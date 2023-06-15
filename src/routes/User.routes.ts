import { Router, Request, Response, NextFunction } from "express"
import asyncHandler from 'express-async-handler'
import UserService from "../services/UserService"

const userService = UserService.getInstance()
const usersRoute = Router()

usersRoute.post('/register', asyncHandler(async (req: Request, res: Response, next: NextFunction): 
Promise<any> => {
    const { password, ...newUser} = await userService.createUser(req.body)
    return res.status(201).json({
        data: newUser
    })
}))

usersRoute.post('/login', asyncHandler(async (req: Request, res: Response, next: NextFunction):
Promise<any> => {
    const user = await userService.loginUser(req.body)
    const session:any = req.session
    session.info = {
        contador : 1,
        username : user.email,
        role : user.role,
    }

    return res.status(200).json({
        data: `Bienvenido ${user.firstName}`
    })
}))

usersRoute.post('/logout', asyncHandler(async (req: Request, res: any, next: NextFunction): 
Promise<any> => {
    const session:any = req.session
    session.destroy((err:any) => {
        if (!err) {        
            res.send('Logout ok!')
        }
        else res.send({ status: 'Logout ERROR', body: err })
    })
}))

usersRoute.get('/session', asyncHandler(async (req: Request, res: Response, next: NextFunction): 
Promise<any> => {
    return res.json({
        session: req.session
    })
}))

export default usersRoute
