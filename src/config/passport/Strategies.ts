import { Request } from "express"
import { Strategy as LocalStrategy } from "passport-local"
import passport from "passport"
import { User } from "../../entities/IUser"
import UserService from "../../services/UserService"

const userService = UserService.getInstance()

const strategyOptions: any = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}

const signup: any = async (req: Request, email: string, password: string, done: any) => {
    try {
        const newUser = await userService.createUser(req.body)
        return done(null, newUser)
    } catch (error) {
        done(error)
    }
}

const login: any = async (req: Request, email: string, password: string, done: any) => {
    const user = { email, password }
    try {
        const userLogin = await userService.loginUser({ email, password })
        return done(null, userLogin)
    } catch (error) {
        done(error)
    }
}

const signupStrategy = new LocalStrategy(strategyOptions, signup)
const loginStrategy = new LocalStrategy(strategyOptions, login)

//saves user in req.session.passport
passport.serializeUser((user: Partial<User>, done: any) => {
    done(null, user._id)
})

passport.deserializeUser(async (req:any, id: string, done: any) => {
    const user = await userService.findUser({ _id: id })
    return done(null, user)
})

export const initializePassport = () => {
    passport.use('register', signupStrategy)
    passport.use('login', loginStrategy)
}
