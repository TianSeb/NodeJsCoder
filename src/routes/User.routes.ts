import { Router } from "express"
import passport from "passport"
import { isAuthenticated } from "../middlewares/AuthMw"
import asyncHandler from 'express-async-handler'
import UserController from "../controllers/UserController"

const usersRoute = Router()
const userController = new UserController()

usersRoute.post('/register', asyncHandler(userController.registerJwt))
          .post('/login', asyncHandler(userController.loginJwt))
          .post('/logout', asyncHandler(userController.logout))
          .put('/premium/:uid',passport.authenticate('jwt'), isAuthenticated, asyncHandler(userController.changeUserRole))
          .get('/session', asyncHandler(userController.createSession))
          .get('/jwt-test', passport.authenticate('jwt'), asyncHandler(userController.privateJwt))

export default usersRoute
