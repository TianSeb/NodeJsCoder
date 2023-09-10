import jwt from 'jsonwebtoken'
import config from '../config/Config'
import type { User } from '../entities/IUser'

export default class SignTokenService {
  private static instance: SignTokenService | null = null
  private readonly LOGIN_TIME = config.accesTokenExpiration ?? '1m'
  private readonly REFRESH_TIME = config.refreshTokenExpiration ?? '1m'

  private constructor() {}

  static getInstance(): SignTokenService {
    if (this.instance === null && this.instance !== undefined) {
      this.instance = new SignTokenService()
    }
    return this.instance
  }

  generateToken(user: Partial<User>): any {
    const { password, ...rest } = user
    const payload: any = { ...rest }

    return jwt.sign(payload._doc, config.jwtSecret, {
      expiresIn: this.LOGIN_TIME
    })
  }

  generateRefreshToken(user: Partial<User>, res: any): any {
    if (user._id !== null) {
      const expirationDate = new Date()
      expirationDate.setTime(
        expirationDate.getTime() + parseInt(this.REFRESH_TIME) * 60 * 1000
      )

      const refreshToken = jwt.sign(
        { userId: user._id },
        config.jwtRefreshSecret,
        {
          expiresIn: this.REFRESH_TIME
        }
      )

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.environment === 'production',
        expires: expirationDate
      })
    }
  }

  verifyRefreshToken(refreshToken: string): any {
    const response = jwt.verify(refreshToken, config.jwtRefreshSecret)
    return response
  }
}
