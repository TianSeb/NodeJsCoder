import { Request, Response } from "express"
import UserService from "../services/UserService"
import { createResponse } from "../utils/Utils"
import { logger } from "../utils/Logger"

const userService = UserService.getInstance()
const RESET_TOKEN: string = 'TOKENPASS'

export default class UserController {

    async registerUserJwt(req: Request, res: Response): Promise<any> {
        const newUser = await userService.createUser(req.body)
        createResponse(res, 201, {
            msg: `User ${newUser.firstName} created`
        })
    }

    async loginJwt(req: Request, res: Response): Promise<any> {
        const access_token: any = await userService.loginUser(req.body)
        if (!access_token) {
            createResponse(res, 404, { msg: 'Not Found' })
        }
        res.header('AUTH_TOKEN', access_token)
        createResponse(res, 201, { msg: 'Login OK', access_token })
    }

    async logout(req: Request, res: Response): Promise<any> {
        req.session.destroy((err) => {
            if (err) {
                logger.error(`Error destroying session ${err}`)
                createResponse(res, 500, { status: 'Logout ERROR', body: err })
            } else {
                createResponse(res, 200, { status: 'Logout ok!' })
            }
        })
    }

    async createSession(req: Request, res: Response): Promise<any> {
        createResponse(res, 201, { user: req.user })
    }

    async privateJwt(req: Request, res: Response): Promise<any> {
        createResponse(res, 200, {
            status: 'OK',
            user: req.user,
        })
    }

    async changeUserRole(req: Request, res: Response): Promise<any> {
        createResponse(res, 200, await userService.changeUserRole(req.params.uid))
    }

    async resetPass(req: Request, res: Response): Promise<any> {
        const user: any = req.user
        const token = await userService.resetPassword(user.email)
        if (!token) {
            createResponse(res, 404, { msg: 'Not Found' })
            logger.debug(`error reseting password for ${user.email}`)
            return
        }
        res.cookie(RESET_TOKEN, token)
        createResponse(res, 200, { msg: 'reset password email sent' })
        logger.debug(`reset password --> email sent ${user.email}`)
    }

    async updatePass(req: Request, res: Response): Promise<any> {
        const user: any = req.user
        const { password } = req.body
        const { TOKENPASS } = req.cookies

        if (!TOKENPASS) {
            createResponse(res, 403, { msg: 'Token Not Found' })
            return
        }
        await userService.updatePassword(user.email, password)
        res.clearCookie(RESET_TOKEN)
        createResponse(res, 201, { msg: 'Password updated' })
    }
}
