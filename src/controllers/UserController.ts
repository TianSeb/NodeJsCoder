import { Request, Response } from "express"
import UserService from "../services/UserService"
import { createResponse } from "../utils/Utils"
import { logger } from "../utils/Logger"

const userService = UserService.getInstance()

export default class UserController {

    private RESET_TOKEN = 'TOKENPASS'

    async registerUserJwt(req: Request, res: Response): Promise<any> {
        const newUser = await userService.createUser(req.body)
        createResponse(res, 201, {
            msg: `User ${newUser.firstName} created`
        })
    }

    async loginJwt(req: Request, res: Response): Promise<any> {
        const access_token = await userService.loginUser(req.body)
        if (access_token) {
            res.header('AUTH_TOKEN', access_token)
            createResponse(res, 201, { msg: 'Login OK', access_token })
        }
        createResponse(res, 404, { msg: 'Not Found' })
    }

    async logout(req: Request, res: Response): Promise<any> {
        req.logOut((err: any) => {
            if (err) createResponse(res, 404, { status: 'Logout ERROR', body: err })
            createResponse(res, 200, { status: 'Logout ok!' })
        })
    }

    async createSession(req: Request, res: Response): Promise<any> {
        createResponse(res, 201, { session: req.session })
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
        const userEmail = req.params.uem
        const token = await userService.resetPassword(userEmail)
        if (token) {
            res.cookie(this.RESET_TOKEN, token)
            createResponse(res, 200, { msg: 'email reset password sent' })
            logger.debug('reset password email sent')
        }
        createResponse(res, 404, { msg: 'Not Found' })
        logger.debug(`error reseting password for ${userEmail}`)
    }

    async updatePass(req: Request, res: Response): Promise<any> {
        const userEmail = req.params.uem
        const { pass } = req.body
        const { tokenpass } = req.cookies

        if(!tokenpass) createResponse(res, 403, { msg: 'Token Not Found' })
        await userService.updatePassword(userEmail, pass)
        res.clearCookie(this.RESET_TOKEN)
        createResponse(res, 201, { msg: 'Password updated' })
    }
}
