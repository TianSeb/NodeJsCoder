import { Router } from "express"
import passport from "passport"
import asyncHandler from 'express-async-handler'
import UserController from "../controllers/UserController"

const usersRoute = Router()
const userController = new UserController()

usersRoute.post('/register', asyncHandler(userController.registerJwt))
          .post('/login', asyncHandler(userController.loginJwt))
          .post('/logout', asyncHandler(userController.logout))
          .get('/session', asyncHandler(userController.createSession))
          .get('/jwt-test', passport.authenticate('jwt'), asyncHandler(userController.privateJwt))

export default usersRoute
