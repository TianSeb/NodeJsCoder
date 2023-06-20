import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import createError from 'http-errors'

export const validateId = (req: Request, res: Response, next: NextFunction) => {
    try {
        const ObjectId = req.params.pid || ""
        console.log(`EL OBJECT ID ES ${ObjectId} + ${JSON.stringify(req.params)}`)
        if (ObjectId) {
        const newId = new mongoose.Types.ObjectId(ObjectId)
        next(newId)
        }
        next()
    } catch (error: any) {
        throw createError.NotAcceptable(`id field error: ${error}`)
    }
}
