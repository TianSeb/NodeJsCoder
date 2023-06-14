import DaoFactory from '../dao/DaoFactory'
import { User } from '../entities/IUser'
import { UserModel } from '../dao/mongo/models/User'

const userDao = DaoFactory.getUserDaoInstance()

export default class UserService {

    private static instance: UserService | null = null

    constructor() {}

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService()
        }
        return UserService.instance
    }
    async createUser(data: any): Promise<User> {
        const user: User = new UserModel({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            age: data.age,
            role: data.role
        })
        
        return await userDao.createUser(user)
    }

    async loginUser(data: any): Promise<User> {
        return await userDao.loginUser(data)
    }
}
