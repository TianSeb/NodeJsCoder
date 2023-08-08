import passport from "passport"
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import UserService from "../../services/UserService"
import config from "../Config"
import { logger } from "../../utils/Logger"

const userService = UserService.getInstance()

const strategyOptions: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

const verifyToken: any = async (jwt_payload:any, done:any): Promise<any> => {
    logger.debug('reading payload--->', jwt_payload)
    const user = await userService.findUser({ _id: jwt_payload.userId })
    if (!user) return done(null, false)
    return done(null, jwt_payload)
}

passport.serializeUser((user: any, done: any) => {
    logger.debug('serializing user')
    done(null, user.userId)
})

passport.deserializeUser(async (req:any, id: string, done: any) => {
    logger.debug('deserializing user')
    const user = await userService.findUser({ _id: id })
    done(null, user)
})

export const initializeJwtPassport = () => {
    passport.use('jwt', new JwtStrategy(strategyOptions, verifyToken))
}
