import DaoFactory from '../persistence/DaoFactory'
import UserRepository from '../persistence/mongo/repository/UserRepository'
import createError from 'http-errors'
import { User } from '../entities/IUser'
import { createHash } from '../utils/Utils'
import { isValidPassword } from '../utils/Utils'
import { logger } from '../utils/Logger'
import { UserRoles } from '../entities/IUser'
import { UserModel } from '../persistence/mongo/models/User'

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
                role: UserRoles.ADMIN
            })
        }

        return await this.userManager.createUser({
            ...user,
            password: createHash(password),
            role: UserRoles.USER
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

    async changeUserRole(userId: string): Promise<void> {
        const userRole = await this.getUserRole(userId)
        let updatedRole = (userRole === UserRoles.PREMIUM) ? UserRoles.USER : UserRoles.PREMIUM
        logger.debug(`changing role: ${userRole} to: ${updatedRole}`)

        await this.userManager.updateUserRole(userId, updatedRole)
    }

    private async getUserRole(userId: string) {
        const allowedRoles = [UserRoles.PREMIUM, UserRoles.USER]

        const user = await UserModel.findById(userId)
        if (!user) throw new createError.NotFound(`User Not Found`)

        const userRole = user.role
        if (!userRole) throw new createError.NotFound(`User Not Found`)

        if (!allowedRoles.includes(userRole)) {
            throw new createError.Forbidden(`Wrong username or password`)
        }
        return userRole
    }

    private isAdmin(email: string, password: string): boolean {
        return email === 'admin@user.com' &&
            password === 'admin1234'
    }
}
