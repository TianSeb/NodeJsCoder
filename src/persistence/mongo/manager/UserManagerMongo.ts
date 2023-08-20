
import { ObjectId } from "mongodb"
import MongoDao from "../MongoDao"
import { UserModel } from "../models/User"
import { User } from "../../../entities/IUser"
import { UserDao } from "../../interfaces/UserDao"
import { logger } from "../../../utils/Logger"

export default class UserManagerMongo extends MongoDao<User> implements UserDao {

    constructor() {
        super(UserModel)
    }

    async createUser(user: User): Promise<User> {
        const newUser = await super.create(user)
        logger.info("User created")
        return newUser
    }

    async findUser(user:any): Promise<User | null> {
        return await UserModel.findOne(user)
    }

    async updateUserRole(userId: string, newRole: string): Promise<void> {
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { role: newRole}, { new: true })
        const updatedRole = updatedUser !== null ? updatedUser.role : undefined
        logger.debug(`User role updated to: ${updatedRole}`)
    }
}