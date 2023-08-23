import { Request, Response, NextFunction } from "express"
import UserService from "../services/UserService"
import { generateToken } from "../config/jwt/JwtAuth"
import { createResponse } from "../utils/Utils"
import { getUserRole } from "../utils/Utils"

const userService = UserService.getInstance()

export default class UserController {

    async registerJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { firstName, lastName, email, age, password } = req.body
        const exist = await userService.findUser({ email })
        if (exist) return res.status(400).json({ msg: 'user already exists'})
        const user = { firstName, lastName, email, age, password }
        const newUser = await userService.createUser(user)

        createResponse(res, 201, {
            msg: `User ${newUser.firstName} created`
        })
    }

    async loginJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        const user = await userService.loginUser(req.body)
        const access_token = generateToken(user)
        res.header('AUTH_TOKEN', access_token)
        createResponse(res, 201, { msg: 'Login OK', access_token })
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
        req.logOut((err: any) => {
            if (err) createResponse(res, 404, { status: 'Logout ERROR', body: err })
            createResponse(res, 200, { status: 'Logout ok!'})
        })
    }

    async createSession(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 201, { session: req.session })
    }

    async privateJwt(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, {
            status: 'OK',
            user: req.user,
        })
    }

    async changeUserRole(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await userService.changeUserRole(req.params.uid))
    }
}
