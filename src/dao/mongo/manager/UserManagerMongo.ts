
import MongoDao from "../MongoDao"
import { UserModel } from "../models/User"
import { User } from "../../../entities/IUser"
import { UserDao } from "../../interfaces/UserDao"

export default class UserManagerMongo extends MongoDao<User> implements UserDao {

    constructor() {
        super(UserModel)
    }

    async createUser(user: User): Promise<User> {
        const newUser = await super.create(user)
        return newUser
    }

    async findUser(user:any): Promise<User | null> {
        return await UserModel.findOne(user)
    }
}