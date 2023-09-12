import DaoFactory from '../../DaoFactory'
import UserResponseDTO from '../dtos/user/User.Response'

export default class UserRepository {
  private static instance: UserRepository | null = null
  private readonly userManager

  constructor() {
    this.userManager = DaoFactory.getUserManagerInstance()
  }

  static getInstance(): UserRepository {
    if (this.instance === null && this.instance !== undefined) {
      this.instance = new UserRepository()
    }
    return this.instance
  }

  async findUser(data: any): Promise<UserResponseDTO | null> {
    const userFound = await this.userManager.findUser(data)
    let userDto = null
    if (userFound !== null) {
      userDto = new UserResponseDTO(userFound)
    }
    return userDto
  }

  async getUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userManager.findAllUsers()
    const usersDto = users.map((user) => new UserResponseDTO(user))
    return usersDto
  }
}
