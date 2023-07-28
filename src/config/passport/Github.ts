import { Strategy as GithubStrategy } from "passport-github2"
import passport from "passport"
import config from "../Config"
import { UserGithub, User } from "../../entities/IUser"
import UserService from "../../services/UserService"

const userService = UserService.getInstance()

const strategyOptions: any = {
    clientID: config.gitClientId,
    clientSecret: config.gitClientSecret,
    callbackURL: config.gitCallbackUrl,
}

const regiterOrLogin = async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    const email = profile.id !== null ? profile.id : profile._json.login
    const user = await userService.findUser({ email: email })

    if (!user) {
        const newUser: UserGithub = {
            firstName: profile._json.name.split(' ')[0] || '',
            lastName: profile._json.name || '',
            email: email,
            password: 'github',
            isGithub: true,
        }
        const response = await userService.createUser(newUser as User)
        done(null, response)
    }
    done(null, user)
}

passport.serializeUser((user: Partial<User>, done: any) => {
    done(null, user._id)
})

passport.deserializeUser(async (req:any, id: string, done: any) => {
    const user = await userService.findUser({ _id: id })
    done(null, user)
})


export const initializeGitPassport = () => {
    passport.use('github', new GithubStrategy(strategyOptions, regiterOrLogin))
}
