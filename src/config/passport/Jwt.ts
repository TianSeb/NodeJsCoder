import passport from "passport"
import { ExtractJwt, Strategy as jwtStrategy } from 'passport-jwt'
import UserService from "../../services/UserService"

const userService = UserService.getInstance()

const strategyOptions: any = {
    jwtFromRquest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '1234'
}

const verifyToken = async (jwt_payload:any, done:any) => {
    console.log('payload--->', jwt_payload)
    const user = await userService.findUser({ _id: jwt_payload.userId })
    if (!user) return done(null, false)
    return done(null, jwt_payload)
}

export const initializeJwtPassport = () => {
    passport.use('jwt', new jwtStrategy(strategyOptions, verifyToken))
}

