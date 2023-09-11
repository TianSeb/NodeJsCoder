import jwt from 'jsonwebtoken'
import config from '../config/Config'
import type { User } from '../entities/IUser'
import createError from 'http-errors'

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

  generateRefreshToken(user: Partial<User>): string | null {
    if (user._id !== null) {
      return jwt.sign({ userId: user._id }, config.jwtRefreshSecret, {
        expiresIn: this.REFRESH_TIME
      })
    }
    return null
  }

  verifyRefreshToken(refreshToken: string): any {
    try {
      return jwt.verify(refreshToken, config.jwtRefreshSecret)
    } catch (error) {
      throw new createError[400]('refresh token expired')
    }
  }
}
