import passport from "passport"
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import UserService from "../../services/UserService"

const userService = UserService.getInstance()

const strategyOptions: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '1234'
}

const verifyToken: any = async (jwt_payload:any, done:any): Promise<any> => {
    console.log('payload--->', jwt_payload)
    const user = await userService.findUser({ _id: jwt_payload.userId })
    if (!user) return done(null, false)
    return done(null, jwt_payload)
}

/* ---------- */
// extract token from cookies
const cookieExtractor: any = (req:any) => {
    const token = req.cookies.token
    return token
}

const strategyOptionsCookies: any = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: '1234'
}

/* ---------- */

passport.serializeUser((user: any, done: any) => {
    console.log('user--->', user)
    done(null, user.userId)
})

passport.deserializeUser(async (req:any, id: string, done: any) => {
    const user = await userService.findUser({ _id: id })
    done(null, user)
})

export const initializeJwtPassport = () => {
    passport.use('jwt', new JwtStrategy(strategyOptions, verifyToken))
    passport.use('jwtCookies', new JwtStrategy(strategyOptionsCookies, verifyToken))
}
