import { Request, Response, NextFunction } from "express"
import config from "../config/Config"
import ProductService from "../services/ProductService"
import { CustomProductRequest } from "../middlewares/ProductMw"
import { createResponse } from "../utils/Utils"

const productService = ProductService.getInstance()

export default class ProductController {

    async getProducts(req: CustomProductRequest, res: Response, next: NextFunction): Promise<any> {
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
    }

    async getProductById(req: CustomProductRequest, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 201, await productService.getProductById(req.params.pid))
    }

    async addProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 201, await productService.addProduct(req.body))
    }

    async deleteProductById(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await productService.deleteProductById(req.params.pid))
    }

    async updateProductById(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await productService.updateProductById(req.params.pid, req.body))
    }

    async deleteAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await productService.deleteAll())
    }
}
