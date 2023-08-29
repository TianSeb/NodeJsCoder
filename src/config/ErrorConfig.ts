import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { createResponse } from '../utils/Utils'
import { logger } from '../utils/Logger'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof createError.HttpError || err instanceof createError.BadRequest) {
        createResponse(res, err.statusCode, { error: err.message })
        logger.error(`Unhandled error ${err.statusCode} : ${err.message}`)
    } else {
        createResponse(res, 500, {
            error: 'Internal Server Error',
            msg: err.message
        })
        logger.error(`Unhandled error ${err.statusCode} : ${err.message}`)
    }
}

export default errorHandler
