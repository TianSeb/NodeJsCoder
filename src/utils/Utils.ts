import bcrypt from 'bcrypt'
import { logger } from './Logger'
import type { User, UserRoles } from '../entities/IUser'

export const createHash = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (password: string, user: any): boolean => {
  return bcrypt.compareSync(password, user.password)
}

export const createResponse = (
  res: any,
  statusCode: any,
  data: any
): string => {
  return res.status(statusCode).json({ data })
}

export const getUserRole = (req: any): UserRoles | undefined => {
  if (req.user !== null) {
    const user: Partial<User> = req.user
    const userRole: UserRoles | undefined = user.role
    return userRole
  }
  return undefined
}

export const handleTryCatchError = (legend: string, error: unknown): void => {
  if (error instanceof Error) {
    logger.error(`${legend}: ${error.message}`)
  } else {
    logger.error(`${legend}: ${String(error)}`)
  }
}
