import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import passport from "passport"
import config from "../Config"
import { UserGoogle, User } from "../../entities/IUser"
import UserService from "../../services/UserService"

const userService = UserService.getInstance()

//console.cloud.google.com
const strategyOptions: any = {
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: "/users/oauth2/redirect/accounts.google.com",
    scope: [ 'profile', 'email' ],
    state: true
}

const regiterOrLogin = async (accessToken: any, refreshToken: any,
    profile: any, done: any) => {

    const email = profile._json.email !== null ? profile._json.email : profile._json.sub
    const user = await userService.findUser({ email: email })

    if (!user) {
        const newUser: UserGoogle = {
            firstName: profile._json.given_name || '',
            lastName: profile._json.family_name || '',
            email: email,
            password: 'google',
            isGoogle: true,
        }

        const response = await userService.createUser(newUser as User)
        done(null, response)
    }
    done(null, user)
}

export const initializeGooglePassport = () => {
    passport.use('google', new GoogleStrategy(strategyOptions, regiterOrLogin))
}