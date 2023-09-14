import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import { logger } from './Logger'
import type { ProductOwnerInfo } from '../entities/IProduct'

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

export const getUserRoleAndMail = (user: any): ProductOwnerInfo => {
  if (user === null) {
    throw new createHttpError.BadRequest('You must be logged in')
  }

  return {
    ownerRole: user.role,
    userEmail: user.email
  }
}

export const handleTryCatchError = (legend: string, error: unknown): void => {
  if (error instanceof Error) {
    logger.error(`${legend}: ${error.message}`)
  } else {
    logger.error(`${legend}: ${String(error)}`)
  }
}
