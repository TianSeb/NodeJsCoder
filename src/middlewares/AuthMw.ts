/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/Logger'
import type { User } from '../entities/IUser'
import { UserRoles } from '../entities/IUser'
import createError from 'http-errors'

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.debug('isAuthenticated Middleware')
  if (req.isAuthenticated()) {
    logger.debug('User is authenticated')
    return next()
  }
  if (req.headers.accept != null && req.headers.accept.includes('text/html')) {
    return res.render('pages/login')
  }
  logger.debug('User not authorized')
  return next(createError(403, 'Not Authorized'))
}

export const validateUserRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.debug('validating user role')
  if (req.user !== null && req.user !== undefined) {
    const userRole: Partial<User> = req.user
    logger.debug(`User Role is: ${userRole.role}`)

    if (
      userRole.role === UserRoles.ADMIN ||
      userRole.role === UserRoles.PREMIUM
    ) {
      return next()
    }
  }
  return next(createError(403, 'User Role Not Authorized'))
}
