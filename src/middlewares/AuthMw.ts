import { Request, Response, NextFunction } from "express"
import createError from 'http-errors'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next()
  }
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.render('pages/login')
  }
  return next(createError(403, 'Not Authorized'))
}
