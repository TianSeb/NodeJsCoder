import { Request, Response, NextFunction } from "express"
import { logger } from "../utils/Logger"
import { User } from "../entities/IUser"
import { UserRoles } from "../entities/IUser"
import createError from 'http-errors'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  logger.debug("isAuthenticated")
  if (req.isAuthenticated()) {
    return next()
  }
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.render('pages/login')
  }
  return next(createError(403, 'Not Authorized'))
}

export const validateUserRole = (req: Request, res: Response, next: NextFunction) => {
  logger.debug("validating user role")
  if (req.user) {
    const userRole: Partial<User> = req.user
    logger.debug(`User Role is: ${userRole.role}`)

    if (userRole.role == UserRoles.ADMIN || userRole.role == UserRoles.PREMIUM) {
      return next()
    }
  }
  return next(createError(403, 'Not Authorized'))
}
