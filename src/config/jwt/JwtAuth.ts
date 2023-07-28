import jwt from "jsonwebtoken"
import config from "../Config"
import { User } from "../../entities/IUser"

const PRIVATE_KEY = config.jwtSecret

export const generateToken = (user: Partial<User>) => {
    const payload = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
    }

    const token = jwt.sign(payload, PRIVATE_KEY, {
        expiresIn: '30m'
    })
    return token
}
