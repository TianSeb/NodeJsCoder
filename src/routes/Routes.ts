import { Router } from "express"
import productsRoute from "./Product.routes"
import cartsRoute from "./Cart.routes"
import viewsRoutes from "./Views.routes"
import usersRoute from "./User.routes"
import { requireLogin } from "../middlewares/GenericMw"

const routes = Router()

routes.use('/api',requireLogin, productsRoute, cartsRoute)
routes.use('/', viewsRoutes, usersRoute)

export default routes