import { Router } from "express"
import passport from "passport"
import { isAuthenticated } from "../middlewares/AuthMw"
import productsRoute from "./Product.routes"
import cartsRoute from "./Cart.routes"
import viewsRoutes from "./Views.routes"
import usersRoute from "./User.routes"
import mockRoute from "./Mock.routes"

const routes = Router()

routes.use('/api', passport.authenticate('jwt'), isAuthenticated, productsRoute, cartsRoute)
routes.use('/users', usersRoute)
routes.use('/', viewsRoutes, mockRoute)

export default routes
