import { Router } from "express"
import productsRoute from "./Product.routes"
import cartsRoute from "./Cart.routes"
import viewsRoutes from "./Views.routes"
import usersRoute from "./User.routes"

const routes = Router()

routes.use('/api', passport.authenticate('jwt'), isAuthenticated, productsRoute, cartsRoute)
routes.use('/users', usersRoute)
routes.use('/', viewsRoutes)

export default routes
