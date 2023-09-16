import type { Request, Response } from 'express'
import UserService from '../services/UserService'
import SignTokenService from '../services/SignTokenService'
import { sendResetPassword } from '../config/email/email'
import { createResponse } from '../utils/Utils'
import { logger } from '../utils/Logger'
import UserResponseDTO from '../persistence/mongo/dtos/user/User.Response'

const userService = UserService.getInstance()
const signTokenService = SignTokenService.getInstance()
const RESET_TOKEN: string = 'TOKENPASS'
const AUTHORIZATION_HEADER = 'Authorization'
const REFRESH_HEADER = 'RefreshToken'
export default class UserController {
  async registerUserJwt(req: Request, res: Response): Promise<any> {
    const newUser = await userService.createUser(req.body)
    createResponse(res, 201, {
      msg: `User ${newUser.firstName} created`
    })
  }

  async loginJwt(req: Request, res: Response): Promise<any> {
    const userFound = await userService.loginUser(req.body)
    const accessToken = signTokenService.generateToken(userFound)
    const refreshToken = signTokenService.generateRefreshToken(userFound)

    res.setHeader(AUTHORIZATION_HEADER, `Bearer ${accessToken}`)
    res.setHeader(REFRESH_HEADER, `Bearer ${refreshToken}`)
    createResponse(res, 201, { msg: 'Login OK', accessToken, refreshToken })
  }

  async logout(req: Request, res: Response): Promise<any> {
    res.clearCookie('refreshToken')
    res.clearCookie('AUTH_TOKEN')
    req.session.destroy((err: any) => {
      if (err !== null) {
        logger.error(`Error destroying session ${err}`)
        createResponse(res, 500, { status: 'Logout ERROR', body: err })
      } else {
        createResponse(res, 200, { status: 'Logout ok!' })
      }
    })
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { userId } = signTokenService.verifyRefreshToken(
      req.body.refreshToken
    )
    const userFound = await userService.findUserWithFilter({ _id: userId })
    const accessToken = signTokenService.generateToken(userFound)

    res.header(AUTHORIZATION_HEADER, accessToken)
    createResponse(res, 200, { status: 'Refresh Ok', accessToken })
  }

  async getCurrentUser(req: Request, res: Response): Promise<any> {
    if (req.user !== null && req.user !== undefined) {
      const userDto = new UserResponseDTO(req.user)
      createResponse(res, 201, userDto)
    }
  }

  async getUsers(req: Request, res: Response): Promise<any> {
    createResponse(res, 201, await userService.getUsers())
  }

  async changeUserRole(req: Request, res: Response): Promise<any> {
    await userService.changeUserRole(req.params.email)
    createResponse(res, 200, 'User role changed')
  }

  async resetPass(req: Request, res: Response): Promise<any> {
    const user: any = req.user
    const userFound = await userService.findUserWithFilter({
      email: user.email
    })
    if (userFound === null) {
      createResponse(res, 404, { msg: 'Not Found' })
      logger.debug(`error reseting password for ${user.email}`)
      return
    }
    const accessToken = signTokenService.generateToken(userFound)
    await sendResetPassword(user.email, accessToken)
    res.cookie(RESET_TOKEN, accessToken)
    createResponse(res, 200, { msg: 'reset password email sent' })
    logger.debug(`reset password --> email sent ${user.email}`)
  }

  async updatePass(req: Request, res: Response): Promise<any> {
    const user: any = req.user
    const { password } = req.body
    const { TOKENPASS } = req.cookies

    if (TOKENPASS !== null) {
      createResponse(res, 403, { msg: 'Token Not Found' })
      return
    }
    await userService.updatePassword(user.email, password)
    res.clearCookie(RESET_TOKEN)
    createResponse(res, 201, { msg: 'Password updated' })
  }

  async deleteUsers(req: Request, res: Response): Promise<any> {
    const deletedCount = await userService.deleteUsers()
    createResponse(res, 200, `${deletedCount} users deleted`)
  }
}
