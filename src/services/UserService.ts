import DaoFactory from '../dao/DaoFactory'
import createError from 'http-errors'
import { User } from '../entities/IUser'
import { createHash } from '../utils/Utils'
import { isValidPassword } from '../utils/Utils'

const userManager = DaoFactory.getUserDaoInstance()

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
        const userExist = await userManager.findUser({ email })
        if (userExist) throw new createError
            .BadRequest(`User with email ${email} already exists`)

        if (this.isAdmin(email, password)) {
            return await userManager.createUser({
                ...user,
                password: createHash(password),
                role: 'admin'
            })
        }

        return await userManager.createUser({
            ...user,
            password: createHash(password),
            role: 'user'
        })
    }

    async loginUser(data: any): Promise<User> {
        const { email, password } = data
        const userFound = await userManager.findUser({ email })
        console.log(userFound)
        if (!userFound) throw new createError.Forbidden(`Wrong username or password`)
        const checkPassword = isValidPassword(password, userFound)
        if (!checkPassword) throw new createError.Forbidden(`Wrong username or password`)
        return userFound
    }

    async findUser(filter: any): Promise<User | null> {
        return await userManager.findUser(filter)
    }

    private isAdmin(email: string, password: string): boolean {
        return email === 'adminCoder@coder.com' &&
            password === 'adminCoder123'
    }
}
