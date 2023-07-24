import { Router } from "express"
import asyncHandler from 'express-async-handler'
import ProductController from "../controllers/ProductController"
import { ProductSchemaValidator } from "../dao/mongo/models/Product"
import { pipelineParams } from "../middlewares/validators/ProductMw"
import { validateSchema } from "../middlewares/validators/ProductMw"

const productController = new ProductController()
const productsRoute = Router()

productsRoute.get('/products', pipelineParams, asyncHandler(productController.getProducts))
             .get('/products/:pid', asyncHandler(productController.getProductById))
             .post('/products/', validateSchema(ProductSchemaValidator), asyncHandler(productController.addProduct))
             .put('/products/:pid', asyncHandler(productController.updateProductById))
             .delete('/products/:pid', asyncHandler(productController.deleteProductById))
             .delete('/products/', asyncHandler(productController.deleteAll))

export default productsRoute
