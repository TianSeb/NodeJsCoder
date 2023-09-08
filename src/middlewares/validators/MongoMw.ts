import type { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import createError from 'http-errors'
import { logger } from '../../utils/Logger'

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const ObjectId = req.params.pid ?? ''
    logger.info(`EL OBJECT ID ES ${ObjectId} + ${JSON.stringify(req.params)}`)
    if (ObjectId !== null) {
      const newId = new mongoose.Types.ObjectId(ObjectId)
      next(newId)
    }
    next()
  } catch (error: any) {
    logger.error(error.msg)
    throw createError.NotAcceptable(`id field error: ${error}`)
  }
}
