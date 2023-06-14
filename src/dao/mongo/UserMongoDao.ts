import createError from 'http-errors'
import MongoDao from "./MongoDao"
import { UserModel } from "./models/User"
import { User } from "../../entities/IUser"
import { UserDao } from "../interfaces/UserDao"

export default class UserMongoDao extends MongoDao<User> implements UserDao {

    constructor() {
        super(UserModel)
    }

    async createUser(user: User): Promise<User> {
        const { email, password } = user
        const userExist = await UserModel.find({ email })

        if (userExist.length !== 0) throw new createError
                                            .BadRequest(`User with email ${email} already exists`)

        if (this.isAdmin(email, password)) {
            return await super.create({ ...user, role: 'admin'})
        } else {
            return super.create(user)
        }
    }

    async loginUser(user: User): Promise<User> {
        const { email, password } = user
        const userExist = await UserModel.find({ email, password })

        if (userExist.length === 0) throw new createError
                                            .Forbidden(`Wrong username or password`)

        return userExist[0]
    }

    private isAdmin(email:string, password:string): boolean {
        return email === 'adminCoder@coder.com' && 
               password === 'adminCoder123'
    }
}