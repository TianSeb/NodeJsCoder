import { Request, Response, NextFunction } from "express"
import createError from 'http-errors'
import { logger } from "../utils/Logger"

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction ) => {
  logger.debug(`${req.method} for ${req.url} - ${new Date().toLocaleDateString()}`)
  next()
}