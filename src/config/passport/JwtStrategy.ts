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
  logger.debug(`reading payload ---> ${JSON.stringify(jwtPayload)}`)
  const user = await userService.findUserWithFilter({
    _id: jwtPayload._id
  })
  if (user === null) return done(null, false)
  return done(null, jwtPayload)
}

passport.serializeUser((jwtPayload: any, done: any) => {
  logger.debug(`serializing user ${JSON.stringify(jwtPayload.email)}`)
  done(null, jwtPayload._id)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
passport.deserializeUser(async (req: any, id: string, done: any) => {
  logger.debug('deserializing user')
  const user = await userService.findUserWithFilter({ _id: id })
  done(null, user)
})

export const initializeJwtPassport = (): void => {
  passport.use('jwt', new JwtStrategy(strategyOptions, verifyToken))
}
