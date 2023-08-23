import { Router } from "express"
import asyncHandler from 'express-async-handler'
import ProductController from "../controllers/ProductController"
import { ProductSchemaValidator } from "../persistence/mongo/models/Product"
import { pipelineParams } from "../middlewares/validators/ProductMw"
import { validateSchema } from "../middlewares/validators/ProductMw"
import { validateUserRole } from "../middlewares/AuthMw"

const productController = new ProductController()
const productsRoute = Router()

productsRoute.get('/products', pipelineParams, asyncHandler(productController.getProducts))
             .get('/products/:pid', asyncHandler(productController.getProductById))
             .post('/products/', validateUserRole, validateSchema(ProductSchemaValidator), asyncHandler(productController.addProduct))
             .put('/products/:pid', validateUserRole, asyncHandler(productController.updateProductById))
             .delete('/products/:pid', validateUserRole, asyncHandler(productController.deleteProductById))
             .delete('/products/', validateUserRole, asyncHandler(productController.deleteAll))

export default productsRoute
