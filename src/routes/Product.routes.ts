import { Router, Request, Response, NextFunction } from "express"
import asyncHandler from 'express-async-handler'
import config from "../config/Config"
import ProductService from "../services/ProductService"
import { ProductSchemaValidator } from "../dao/mongo/models/Product"
import { pipelineParams, CustomProductRequest } from "../middlewares/ProductMw"
import { validateSchema } from "../middlewares/ProductMw"

const productService = ProductService.getInstance()
const productsRoute = Router()

productsRoute.get('/products', pipelineParams, asyncHandler(async (req: CustomProductRequest, res: Response, next: NextFunction): Promise<any> => {
    const { pipeline, options } = req  
    const response = await productService.getProducts(pipeline, options)
    const nextPage = response.hasNextPage ? `http://localhost:${config.port}/products?page=${response.nextPage}` : null
    const prevPage = response.hasPrevPage ? `http://localhost:${config.port}/products?page=${response.prevPage}` : null

    return res.json({
        status: res.statusCode,
        data: response.docs,
        info: {
            page: response.page,
            totalPages: response.totalPages,
            nextPage,
            prevPage,
            hasNextPage: response.hasNextPage,
            hasPrevPage: response.hasPrevPage
        }
    })
}))

productsRoute.get('/products/:pid', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.json({
        data: await productService.getProductById(req.params.pid)
    })
}))

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
