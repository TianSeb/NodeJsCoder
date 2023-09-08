import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { logger } from '../utils/Logger'

const loggerRoute = Router()

loggerRoute.get(
  '/logger',
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    logger.fatal('fatal')
    logger.error('error')
    logger.warn('warn')
    logger.info('info')
    logger.debug('debug')
    res.send('testing logging')
  })
)

export default loggerRoute
