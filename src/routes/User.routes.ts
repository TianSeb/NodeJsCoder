import { Router, Request, Response, NextFunction } from "express"
import passport from "passport"
import asyncHandler from 'express-async-handler'

const usersRoute = Router()

usersRoute.post('/register', passport.authenticate('register'), asyncHandler(async (req: any, res: Response,
    next: NextFunction): Promise<any> => {
    return res.status(201).json({
        msg: `User ${req.user.email} created`
    })
}))

usersRoute.post('/login', passport.authenticate('login'), asyncHandler(async (req: any, res: Response,
    next: NextFunction): Promise<any> => {
    return res.status(200).json({
        data: `Bienvenido ${req.user.firstName}`
    })
}))

usersRoute.post('/logout', asyncHandler(async (req: Request, res: any,
    next: NextFunction): Promise<any> => {
    const session: any = req.session
    session.destroy((err: any) => {
        if (!err) {
            res.send('Logout ok!')
        }
        else res.send({ status: 'Logout ERROR', body: err })
    })
}))

usersRoute.get('/session', asyncHandler(async (req: any, res: Response,
    next: NextFunction): Promise<any> => {
    return res.json({
        session: req.session,
        passport: req.session.passport,
        req: req.user
    })
}))

export default usersRoute
