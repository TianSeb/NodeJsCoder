import { Router } from "express"
import productsRoute from "./Product.routes"
import cartsRoute from "./Cart.routes"
import viewsRoutes from "./Views.routes"

const routes = Router()

routes.use('/api',productsRoute, cartsRoute)
routes.use('/', viewsRoutes)

export default routes