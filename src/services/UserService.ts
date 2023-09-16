import DaoFactory from '../persistence/DaoFactory'
import UserRepository from '../persistence/mongo/repository/UserRepository'
import createError from 'http-errors'
import type { User } from '../entities/IUser'
import { createHash, isValidPassword } from '../utils/Utils'
import { logger } from '../utils/Logger'
import { UserRoles } from '../entities/IUser'
import type UserResponseDTO from '../persistence/mongo/dtos/user/User.Response'
import { sendDeletedEmail } from '../config/email/email'

export default class UserService {
  private static instance: UserService | null = null
  private readonly userManager
  private readonly userRepository

  private constructor() {
    this.userManager = DaoFactory.getUserManagerInstance()
    this.userRepository = UserRepository.getInstance()
  }

  static getInstance(): UserService {
    if (this.instance === null && this.instance !== undefined) {
      this.instance = new UserService()
    }
    return this.instance
  }

  async createUser(user: User): Promise<Partial<User>> {
    const { email, password } = user
    const userExist = await this.userManager.findUser({ email })
    if (userExist !== null)
      throw new createError.BadRequest(
        `User with email ${email} already exists`
      )

    return await this.userManager.createUser({
      ...user,
      password: createHash(password),
      role: UserRoles.USER,
      lastConnection: new Date()
    })
  }

  async loginUser(data: any): Promise<User> {
    const { email, password } = data

    const userFound = await this.userManager.findUser({ email })
    if (userFound === null || userFound === undefined)
      throw new createError.Forbidden(`User not found`)

    const checkPassword = isValidPassword(password, userFound)
    if (!checkPassword) throw new createError.Forbidden(`Wrong password`)
    logger.debug(`login User: ${userFound.email}`)
    await this.userManager.updateLastConnection(email)

    return userFound
  }

  async findUserWithFilter(filter: any): Promise<User> {
    logger.debug(`findUserWithFilter ${JSON.stringify(filter)}`)
    const userFound = await this.userManager.findUser(filter)
    if (userFound === null)
      throw new createError.Forbidden(`Wrong username or password`)
    return userFound
  }

  async getUsers(): Promise<UserResponseDTO[]> {
    return await this.userRepository.getUsers()
  }

  async changeUserRole(userEmail: string): Promise<void> {
    const userRole = await this.getUserRole(userEmail)
    const updatedRole =
      userRole === UserRoles.PREMIUM ? UserRoles.USER : UserRoles.PREMIUM
    logger.debug(`changing role: ${userRole} to: ${updatedRole}`)

    await this.userManager.updateUserRole(userEmail, updatedRole)
  }

  async updatePassword(email: string, password: string): Promise<void> {
    const userFound = await this.userManager.findUser({ email })
    const checkPassword = isValidPassword(password, userFound)
    if (checkPassword)
      throw new createError.Forbidden(
        `Password should be different from last password`
      )
    const newPass = createHash(password)
    await this.userManager.updateUserPassword(email, newPass)
  }

  async deleteUsers(): Promise<string> {
    const deletedEmails = await this.userManager.deleteUsers()
    await sendDeletedEmail(deletedEmails)

    return deletedEmails.length.toString()
  }

  private async getUserRole(userEmail: string): Promise<any> {
    const allowedRoles = [UserRoles.PREMIUM, UserRoles.USER]

    const user = await this.findUserWithFilter({ email: userEmail })
    if (user === null || user === undefined)
      throw new createError.NotFound(`User Not Found`)

    const userRole = user.role
    if (userRole === null || userRole === undefined)
      throw new createError.NotFound(`User Role Not Found`)

    if (!allowedRoles.includes(userRole)) {
      throw new createError.Forbidden(`Wrong username or password`)
    }
    return userRole
  }
}
