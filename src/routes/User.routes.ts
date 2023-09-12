import { Router } from 'express'
import passport from 'passport'
import {
  isAuthenticated,
  requireRefreshToken,
  validateUserRole
} from '../middlewares/AuthMw'
import asyncHandler from 'express-async-handler'
import UserController from '../controllers/UserController'
import { UserRoles } from '../entities/IUser'

const usersRoute = Router()
const userController = new UserController()

usersRoute
  .post('/register', asyncHandler(userController.registerUserJwt))
  .post('/login', asyncHandler(userController.loginJwt))
  .post('/logout', asyncHandler(userController.logout))
  .post(
    '/refresh-token',
    requireRefreshToken,
    asyncHandler(userController.refreshToken)
  )
  .post(
    '/reset-password/',
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
    asyncHandler(userController.getCurrentUser)
  )
  .get(
    '/users',
    passport.authenticate('jwt'),
    isAuthenticated,
    asyncHandler(userController.getUsers)
  )
  .delete(
    '/users',
    passport.authenticate('jwt'),
    isAuthenticated,
    validateUserRole([UserRoles.ADMIN, UserRoles.PREMIUM]),
    asyncHandler(userController.deleteUsers)
  )

export default usersRoute
