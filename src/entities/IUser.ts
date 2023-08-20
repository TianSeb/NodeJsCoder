import { Types } from "mongoose"
export interface User {
    _id?: string
    firstName: string
    lastName: string
    email: string
    password: string
    age: Number
    role?: UserRoles
    cart?: Types.ObjectId | string
}

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
    PREMIUM = 'premium'
  }
