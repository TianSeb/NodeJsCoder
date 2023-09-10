import { Router } from 'express'
import passport from 'passport'
import { isAuthenticated, requireRefreshToken } from '../middlewares/AuthMw'
import asyncHandler from 'express-async-handler'
import UserController from '../controllers/UserController'

const usersRoute = Router()
const userController = new UserController()

usersRoute
  .post('/register', asyncHandler(userController.registerUserJwt))
  .post('/login', asyncHandler(userController.loginJwt))
  .post('/logout', asyncHandler(userController.logout))
  .post(
    '/refresh',
    requireRefreshToken,
    asyncHandler(userController.refreshToken)
  )
  .post(
    '/reset/',
    passport.authenticate('jwt'),
    isAuthenticated,
    asyncHandler(userController.resetPass)
  )
  .put(
    '/update-password/',
    passport.authenticate('jwt'),
    isAuthenticated,
    asyncHandler(userController.updatePass)
  )
  .put(
    '/premium/:uid',
    passport.authenticate('jwt'),
    isAuthenticated,
    asyncHandler(userController.changeUserRole)
  )
  .get(
    '/session',
    passport.authenticate('jwt'),
    isAuthenticated,
    asyncHandler(userController.createSession)
  )
  .get(
    '/jwt-test',
    passport.authenticate('jwt'),
    asyncHandler(userController.privateJwt)
  )

export default usersRoute
