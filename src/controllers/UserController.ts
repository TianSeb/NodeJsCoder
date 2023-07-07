import { Request, Response, NextFunction } from "express"
import UserService from "../services/UserService"
import { generateToken } from "../config/jwt/JwtAuth"

const userService = UserService.getInstance()

export default class UserController {

    async registerJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { firstName, lastName, email, age, password } = req.body
        const exist = await userService.findUser({ email })
        if (exist) return res.status(400).json({ msg: 'user already exists'})
        const user = { firstName, lastName, email, age, password }
        const newUser = await userService.createUser(user)
    
        return res.status(201).json({
            msg: `User ${newUser.firstName} created`
        })
    }

    async loginJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        const user = await userService.loginUser(req.body)
        const access_token = generateToken(user)
        res.header('AUTH_TOKEN', access_token)
            .json({ msg: 'Login OK', access_token })    
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
        req.logOut((err: any) => {
            if (err) res.send({ status: 'Logout ERROR', body: err })
            res.send('Logout ok!')
        })
    }

    async createSession(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(201).json({
            session: req.session
        })
    }

    async privateJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            status: 'OK',
            user: req.user,
        })
    }
}
