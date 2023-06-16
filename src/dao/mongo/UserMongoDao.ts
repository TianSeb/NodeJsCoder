import createError from 'http-errors'
import MongoDao from "./MongoDao"
import { UserModel } from "./models/User"
import { User } from "../../entities/IUser"
import { UserDao } from "../interfaces/UserDao"
import { isValidPassword } from '../../utils/Utils'

export default class UserMongoDao extends MongoDao<User> implements UserDao {

    constructor() {
        super(UserModel)
    }

    async createUser(user: User): Promise<User> {
        const { email } = user
        const userExist = await UserModel.findOne({ email })
        
        if (userExist) throw new createError
                                            .BadRequest(`User with email ${email} already exists`)
        const newUser = await super.create(user)
        return newUser
    }

    async loginUser(user: User): Promise<User> {
        const { email, password } = user
        const userExist = await UserModel.findOne({ email })

        if (!userExist) throw new createError.Forbidden(`Wrong username or password`)
        isValidPassword(password, userExist)
        return userExist
    }

    async findUser(filter:any): Promise<User | null> {
        return await UserModel.findOne(filter)
    }
}
