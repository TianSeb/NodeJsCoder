import { Request, Response, NextFunction } from "express"
import UserService from "../services/UserService"
import { generateToken } from "../config/jwt/JwtAuth"

const userService = UserService.getInstance()
export default class UserController {

    async register(req: any, res: Response, next: NextFunction): Promise<any> {
        return res.status(201).json({
            msg: `User ${req.user.email} created`
        })
    }

    async login(req: any, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: `Bienvenido ${req.user.firstName}`
        })
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
        req.logOut((err: any) => {
            if (err) res.send({ status: 'Logout ERROR', body: err })
            res.clearCookie('token')
            res.send('Logout ok!')
        })
    }

    async createSession(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(201).json({
            session: req.session
        })
    }

    async profileGithub(req: any, res: Response, next: NextFunction): Promise<any> {
        res.redirect('/')
        const { firstName, lastName, email, role, isGithub } = req.user
        return res.json({
            msg: 'Github Login OK',
            session: req.session,
            data: {
                firstName,
                lastName,
                email,
                role,
                isGithub
            }
        })
    }

    async registerJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { firstName, lastName, email, age, password } = req.body
        const exist = await userService.findUser({ email })
        if (exist) return res.status(400).json({ msg: 'user already exists'})
        const user = { firstName, lastName, email, age, password }
        const newUser = await userService.createUser(user)
        const token = generateToken(newUser)
    
        return res.status(201).json({
            msg: `User ${newUser.firstName} created`,
            token
        })
    }

    async loginJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        const user = await userService.loginUser(req.body)
        const access_token = generateToken(user)
        res.header('AUTH_TOKEN', access_token)
            .cookie('token', access_token,
                { httpOnly: true }  //--> avoid accesing content from front-end
            )
            .json({ msg: 'Login OK', access_token })    
    }

    async privateJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            status: 'OK',
            user: req.user,
        })
    }
}
