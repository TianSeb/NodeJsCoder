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

  async findAllUsers(): Promise<User[]> {
    return await UserModel.find()
  }

  async updateUserRole(userEmail: string, newRole: string): Promise<User> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: userEmail },
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

  async updateLastConnection(userEmail: string): Promise<void> {
    const loginDate = new Date()
    await UserModel.findOneAndUpdate(
      { email: userEmail },
      { lastConnection: loginDate },
      { new: true }
    )
    logger.debug(`login date updated to ${loginDate.toDateString()}`)
  }

  async deleteUsers(): Promise<string[] | []> {
    const dateLimit = this.calculateDateLimit(2)
    logger.debug(`deleting users older than: ${dateLimit}`)

    const usersToDelete = await UserModel.find({
      lastConnection: { $lt: dateLimit }
    })

    await UserModel.deleteMany({
      lastConnection: { $lt: dateLimit }
    })

    const deletedEmails = usersToDelete.map((user) => user.email)

    return deletedEmails
  }

  private calculateDateLimit(daysToSubtract: number): string {
    const millisecondsInADay = 24 * 60 * 60 * 1000
    const currentDate = new Date().getTime()

    return new Date(
      currentDate - daysToSubtract * millisecondsInADay
    ).toISOString()
  }
}
