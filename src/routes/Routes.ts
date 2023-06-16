import { Router } from "express"
import { requireLogin } from "../middlewares/GenericMw"
import productsRoute from "./Product.routes"
import cartsRoute from "./Cart.routes"
import viewsRoutes from "./Views.routes"
import usersRoute from "./User.routes"

const routes = Router()

routes.use('/api',requireLogin, productsRoute, cartsRoute)
routes.use('/', viewsRoutes, usersRoute)

export default routes
