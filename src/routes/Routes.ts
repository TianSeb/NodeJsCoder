import { Router } from "express"
import passport from "passport"
import { isAuthenticated } from "../middlewares/AuthMw"
import { loggerMiddleware } from "../middlewares/LoggerMw"
import productsRoute from "./Product.routes"
import cartsRoute from "./Cart.routes"
import viewsRoutes from "./Views.routes"
import usersRoute from "./User.routes"
import mockRoute from "./Mock.routes"
import loggerRoute from "./Logger.routes"

const routes = Router()

routes.use('/api', loggerMiddleware, passport.authenticate('jwt'), isAuthenticated, productsRoute, cartsRoute)
routes.use('/users', loggerMiddleware, usersRoute)
routes.use('/', loggerMiddleware, viewsRoutes, mockRoute, loggerRoute)

export default routes
