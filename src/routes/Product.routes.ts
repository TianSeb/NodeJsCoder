import { Router, Request, Response, NextFunction } from "express"
import config from "../config/Config"
import ProductManager from "../services/ProductManager"
import asyncHandler from 'express-async-handler'
import { ProductSchemaValidator } from "../dao/mongo/models/Product"
import { validate, pipelineParams, CustomRequest } from "../utils/Utils"

const productManager = ProductManager.getInstance()
const productsRoute = Router()

productsRoute.get('/products', pipelineParams, asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { pipeline, options } = req  
    const response = await productManager.getProducts(pipeline, options)
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
        data: await productManager.getProductById(req.params.pid)
    })
}))

productsRoute.post('/products/', validate(ProductSchemaValidator), asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(201).json({
        data: await productManager.addProduct(req.body)
    })
}))

productsRoute.put('/products/:pid', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).json({
        data: await productManager.updateProductById(req.params.pid, req.body)
    })
}))

productsRoute.delete('/products/:pid', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).json({
        data: await productManager.deleteProductById(req.params.pid)
    })
}))

productsRoute.delete('/products/', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(200).json({
        data: await productManager.deleteAll()
    })
}))

export default productsRoute