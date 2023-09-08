import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import UserService from '../../services/UserService'
import config from '../Config'
import { logger } from '../../utils/Logger'

const userService = UserService.getInstance()

const strategyOptions: any = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}

const verifyToken: any = async (jwtPayload: any, done: any): Promise<any> => {
  logger.debug(`reading payload---> ${JSON.stringify(jwtPayload)}`)
  const user = await userService.findUser({ _id: jwtPayload.userId })
  if (user === null) return done(null, false)
  return done(null, jwtPayload)
}

passport.serializeUser((user: any, done: any) => {
  logger.debug('serializing user')
  done(null, user.userId)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
passport.deserializeUser(async (req: any, id: string, done: any) => {
  logger.debug('deserializing user')
  const user = await userService.findUser({ _id: id })
  done(null, user)
})

export const initializeJwtPassport = (): void => {
  passport.use('jwt', new JwtStrategy(strategyOptions, verifyToken))
}
