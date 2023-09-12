import DaoFactory from '../persistence/DaoFactory'
import UserRepository from '../persistence/mongo/repository/UserRepository'
import createError from 'http-errors'
import type { User } from '../entities/IUser'
import { createHash, isValidPassword } from '../utils/Utils'
import { logger } from '../utils/Logger'
import { UserRoles } from '../entities/IUser'
import { UserModel } from '../persistence/mongo/models/User'
import type UserResponseDTO from '../persistence/mongo/dtos/user/User.Response'

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
      role: UserRoles.USER
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

  async changeUserRole(userId: string): Promise<void> {
    const userRole = await this.getUserRole(userId)
    const updatedRole =
      userRole === UserRoles.PREMIUM ? UserRoles.USER : UserRoles.PREMIUM
    logger.debug(`changing role: ${userRole} to: ${updatedRole}`)

    await this.userManager.updateUserRole(userId, updatedRole)
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
    const deletedCount = await this.userManager.deleteUsers()
    return deletedCount
  }

  private async getUserRole(userId: string): Promise<any> {
    const allowedRoles = [UserRoles.PREMIUM, UserRoles.USER]

    const user = await UserModel.findById(userId)
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
