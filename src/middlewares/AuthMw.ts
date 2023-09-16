/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/Logger'
import type { UserRoles } from '../entities/IUser'
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

export const requireRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.debug('veryfying refresh token')
  const refreshToken = req.body.refreshToken
  if (refreshToken === null) return next(createError(403, 'Not Authorized'))
  // reddis logic to be developed
  next()
}

export const validateUserRole =
  (allowedRoles: UserRoles[]) =>
  (req: any, res: Response, next: NextFunction): void => {
    logger.debug('validating user role')
    const userRole: UserRoles | undefined = req.user?.role
    if (userRole !== undefined) {
      logger.debug(`User Role is: ${userRole}`)

      if (allowedRoles.includes(userRole)) {
        logger.debug('UserRole Authorized')
        return next()
      }
      logger.debug('Failed to validate user Role in mw')
    }
    return next(createError(403, 'User Role Not Authorized'))
  }
