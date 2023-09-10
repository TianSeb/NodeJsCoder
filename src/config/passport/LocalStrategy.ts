import type { Request } from 'express'
import { Strategy as LocalStrategy } from 'passport-local'
import passport from 'passport'
import type { User } from '../../entities/IUser'
import UserService from '../../services/UserService'
import { logger } from '../../utils/Logger'

const userService = UserService.getInstance()

const strategyOptions: any = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

const signup: any = async (
  req: Request,
  email: string,
  password: string,
  done: any
) => {
  try {
    const newUser = await userService.createUser(req.body)
    done(null, newUser)
  } catch (error) {
    done(error)
  }
}

const login: any = async (
  req: Request,
  email: string,
  password: string,
  done: any
) => {
  try {
    const userLogin = await userService.loginUser({ email, password })
    done(null, userLogin)
  } catch (error) {
    done(error)
  }
}

const signupStrategy = new LocalStrategy(strategyOptions, signup)
const loginStrategy = new LocalStrategy(strategyOptions, login)

// saves user in req.session.passport
passport.serializeUser((user: Partial<User>, done: any) => {
  logger.debug('serializing user')
  done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
passport.deserializeUser(async (req: any, id: string, done: any) => {
  logger.debug('deserializing user')
  const user = await userService.findUserWithFilter({ _id: id })
  done(null, user)
})

export const initializeLocalPassport = (): void => {
  passport.use('register', signupStrategy)
  passport.use('login', loginStrategy)
}
