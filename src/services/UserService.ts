import DaoFactory from '../dao/DaoFactory'
import createError from 'http-errors'
import { User } from '../entities/IUser'
import { createHash } from '../utils/Utils'
import { isValidPassword } from '../utils/Utils'
import UserRepository from '../dao/mongo/repository/UserRepository'
import { logger } from '../utils/Logger'

export default class UserService {

    private static instance: UserService | null = null
    private userManager
    private userRepository

    constructor() {
        this.userManager = DaoFactory.getUserManagerInstance()
        this.userRepository = UserRepository.getInstance()
    }

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService()
        }
        return UserService.instance
    }

    async createUser(user: User): Promise<Partial<User>> {
        const { email, password } = user
        const userExist = await this.userManager.findUser({ email })
        if (userExist) throw new createError
            .BadRequest(`User with email ${email} already exists`)

        if (this.isAdmin(email, password)) {
            return await this.userManager.createUser({
                ...user,
                password: createHash(password),
                role: 'admin'
            })
        }

        return await this.userManager.createUser({
            ...user,
            password: createHash(password),
            role: 'user'
        })
    }

    async loginUser(data: any): Promise<User> {
        const { email, password } = data
        const userFound = await this.userManager.findUser({ email })
        if (!userFound) throw new createError.Forbidden(`Wrong username or password`)
        const checkPassword = isValidPassword(password, userFound)
        if (!checkPassword) throw new createError.Forbidden(`Wrong username or password`)
        logger.debug(`login user ${userFound.email}`)
        return userFound
    }

    async findUser(filter: any): Promise<User | null> {
        return await this.userManager.findUser(filter)
    }

    private isAdmin(email: string, password: string): boolean {
        return email === 'admin@user.com' &&
            password === 'admin1234'
    }
}
