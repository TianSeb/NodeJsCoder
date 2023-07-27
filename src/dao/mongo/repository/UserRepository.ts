import DaoFactory from "../../DaoFactory"
import { User } from '../../../entities/IUser'
import UserResponseDTO from "../dtos/user/User.Response"

export default class UserRepository {

  private static instance: UserRepository | null = null
  private userManager

  constructor() {
    this.userManager = DaoFactory.getUserManagerInstance()

  }

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository()
    }
    return UserRepository.instance
  }

  async findUser(data: any): Promise<UserResponseDTO | null> {
    const userFound = await this.userManager.findUser(data)
    let userDto = null
    if (userFound) {
      userDto = new UserResponseDTO(userFound)
    }

    return userDto
  }
}
