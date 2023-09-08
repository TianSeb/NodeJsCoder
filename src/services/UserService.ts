import DaoFactory from '../persistence/DaoFactory'
import UserRepository from '../persistence/mongo/repository/UserRepository'
import createError from 'http-errors'
import type { User } from '../entities/IUser'
import { createHash, isValidPassword } from '../utils/Utils'
import { generateToken } from '../config/jwt/JwtAuth'
import { sendResetPassword } from '../config/email/email'
import { logger } from '../utils/Logger'
import { UserRoles } from '../entities/IUser'
import { UserModel } from '../persistence/mongo/models/User'

export default class UserService {
  private static instance: UserService | null = null
  private readonly userManager
  private readonly userRepository
  private readonly LOGIN_TIME = '30m'
  private readonly RESET_TIME = '30m'

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

  async loginUser(data: any): Promise<string | null> {
    const { email, password } = data
    const userFound = await this.userManager.findUser({ email })
    if (userFound === null || userFound === undefined)
      throw new createError.Forbidden(`Wrong username or password`)
    const checkPassword = isValidPassword(password, userFound)
    if (!checkPassword)
      throw new createError.Forbidden(`Wrong username or password`)
    const accessToken = generateToken(userFound, this.LOGIN_TIME)

    logger.debug(`login user ${userFound.email}`)

    return accessToken ?? null
  }

  async findUser(filter: any): Promise<User | null> {
    const userFound = await this.userManager.findUser(filter)
    if (userFound === null)
      throw new createError.Forbidden(`Wrong username or password`)
    return userFound
  }

  async changeUserRole(userId: string): Promise<void> {
    const userRole = await this.getUserRole(userId)
    const updatedRole =
      userRole === UserRoles.PREMIUM ? UserRoles.USER : UserRoles.PREMIUM
    logger.debug(`changing role: ${userRole} to: ${updatedRole}`)

    await this.userManager.updateUserRole(userId, updatedRole)
  }

  async resetPassword(email: string): Promise<string> {
    const user = await this.userManager.findUser({ email })
    if (user === null || user === undefined)
      throw new createError.Forbidden(`Wrong username`)
    const accessToken = generateToken(user, this.RESET_TIME)

    await sendResetPassword(user.email, accessToken)
    return accessToken
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
