import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof createError.HttpError || err instanceof createError.BadRequest) {
        res.status(err.statusCode).json({
            error: err.message
        })
    } else {
        res.status(500).json({
            error: 'Internal Server Error',
            msg: err.message
        })
    }
}

export default errorHandler
