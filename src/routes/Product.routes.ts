import { Router, Request, Response, NextFunction } from "express"
import asyncHandler from 'express-async-handler'
import config from "../config/Config"
import ProductService from "../services/ProductService"
import ProductController from "../controllers/ProductController"
import { ProductSchemaValidator } from "../dao/mongo/models/Product"
import { pipelineParams, CustomProductRequest } from "../middlewares/ProductMw"
import { validateSchema } from "../middlewares/ProductMw"

const productService = ProductService.getInstance()
const productController = new ProductController()
const productsRoute = Router()

productsRoute.get('/products', pipelineParams, asyncHandler(productController.getProducts))

productsRoute.get('/products/:pid', asyncHandler(productController.getProductById))

productsRoute.post('/products/', validateSchema(ProductSchemaValidator), asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(201).json({
        data: await productService.addProduct(req.body)
    })
}))

productsRoute.put('/products/:pid', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).json({
        data: await productService.updateProductById(req.params.pid, req.body)
    })
}))

productsRoute.delete('/products/:pid', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).json({
        data: await productService.deleteProductById(req.params.pid)
    })
}))

productsRoute.delete('/products/', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).json({
        data: await productService.deleteAll()
    })
}))

export default productsRoute
