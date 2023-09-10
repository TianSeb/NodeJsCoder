import { UserModel } from '../models/User'
import type { User } from '../../../entities/IUser'
import type { UserDao } from '../../interfaces/UserDao'
import { logger } from '../../../utils/Logger'
import createError from 'http-errors'

export default class UserManagerMongo implements UserDao {
  async createUser(user: User): Promise<User> {
    const newUserInstance = new UserModel(user)
    const newUser = await newUserInstance.save()
    logger.info('User created')
    return newUser
  }

  async findUser(user: any): Promise<User | null> {
    return await UserModel.findOne(user)
  }

  async updateUserRole(userId: string, newRole: string): Promise<User> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { role: newRole },
      { new: true }
    )

    if (updatedUser !== null) {
      logger.debug(`User role updated to: ${updatedUser.role}`)
      return updatedUser
    } else {
      throw new createError.BadRequest('Error updating user')
    }
  }

  async updateUserPassword(userEmail: string, newPass: string): Promise<void> {
    await UserModel.findOneAndUpdate(
      { email: userEmail },
      { password: newPass },
      { new: true }
    )
    logger.debug(`User password updated for user: ${userEmail}`)
  }
}
