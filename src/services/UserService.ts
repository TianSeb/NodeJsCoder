import DaoFactory from '../dao/DaoFactory'
import { User } from '../entities/IUser'
import { createHash } from '../utils/Utils'

const userDao = DaoFactory.getUserDaoInstance()

export default class UserService {

    private static instance: UserService | null = null

    constructor() { }

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService()
        }
        return UserService.instance
    }

    async createUser(user: User): Promise<Partial<User>> {
        const { email, password } = user
        if (this.isAdmin(email, password)) {
            return await userDao.createUser({
                ...user,
                password: createHash(password),
                role: 'admin'
            })
        }
        return await userDao.createUser({
            ...user,
            password: createHash(password)
        })
    }

    async loginUser(data: any): Promise<User> {
        return await userDao.loginUser(data)
    }

    async findUser(filter: any): Promise<User | null> {
        return await userDao.findUser(filter)
    }

    private isAdmin(email: string, password: string): boolean {
        return email === 'adminCoder@coder.com' &&
            password === 'adminCoder123'
    }
}
