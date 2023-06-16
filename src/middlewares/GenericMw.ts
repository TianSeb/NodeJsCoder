import { Request, Response, NextFunction } from "express"
import createError from 'http-errors'

export const requireLogin = (req: any, res: Response, next: NextFunction) => {
    const session: any = req.session
    if (session && session.passport) {
        next()
    } else {
        return next(createError.Forbidden('Not Authorized'))
    }
}

export const validateSchema = (schema:any) => (req:Request, res:Response, next:NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })

      next()
    } catch (err:any) {
        const missingFields = err.issues.map((issue:any) => issue.path.join('.'))
        const errorMessage = `Missing required fields: ${missingFields.join(', ')}`
        return next(createError(400, errorMessage))
    }
}
