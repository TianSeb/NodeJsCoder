import { Request, Response, NextFunction } from "express"
import createError from 'http-errors'
import jwt from "jsonwebtoken"
import { User } from "../../entities/IUser"
import UserService from "../../services/UserService"

const userService = UserService.getInstance()

const PRIVATE_KEY = '1234'

export const generateToken = (user: Partial<User>) => {
    const payload = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        role: user.role
    }

    const token = jwt.sign(payload, PRIVATE_KEY, {
        expiresIn: '2m'
    })
    return token
}


export const checkJwtAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: any = req.headers['auth_token']
        if (!token) return res.status(401).json({ msg: 'Unauthorized' })
        const decode: any = jwt.verify(token, PRIVATE_KEY)
        const user = userService.findUser({ _id: decode.userId })
        if (!user) return res.status(401).json({ msg: 'Unauthorized' })
    
        req.user = user
        return next()
    } catch (error: any) {
        const newError = new createError.Forbidden(`${error}`)
        next(newError)
    }
}