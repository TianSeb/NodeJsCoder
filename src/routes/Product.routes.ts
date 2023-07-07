import { Router } from "express"
import asyncHandler from 'express-async-handler'
import ProductController from "../controllers/ProductController"
import { ProductSchemaValidator } from "../dao/mongo/models/Product"
import { pipelineParams } from "../middlewares/ProductMw"
import { validateSchema } from "../middlewares/ProductMw"

const productController = new ProductController()
const productsRoute = Router()

productsRoute.get('/products', pipelineParams, asyncHandler(productController.getProducts))
productsRoute.get('/products/:pid', asyncHandler(productController.getProductById))
productsRoute.post('/products/', validateSchema(ProductSchemaValidator), asyncHandler(productController.addProduct))
productsRoute.put('/products/:pid', asyncHandler(productController.updateProductById))
productsRoute.delete('/products/:pid', asyncHandler(productController.deleteProductById))
productsRoute.delete('/products/', asyncHandler(productController.deleteAll))

export default productsRoute
