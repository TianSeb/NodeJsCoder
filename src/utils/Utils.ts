import bcrypt from 'bcrypt'
import { User } from '../entities/IUser'

export const createHash = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (password: string, user: any) => {
    return bcrypt.compareSync(password, user.password)
}

export const createResponse = (res:any, statusCode:any, data:any) => {
    return res.status(statusCode).json({data})
}

export const getUserRole = (req: any) => {
    if (req.user) {
        const user: Partial<User> = req.user
        const userRole: any = user.role
        return userRole
    }
}