import type { Types } from 'mongoose'
export interface User {
  _id?: string
  firstName: string
  lastName: string
  email: string
  password: string
  age: number
  role?: UserRoles
  cart?: Types.ObjectId | string
  lastConnection?: Date
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium'
}
