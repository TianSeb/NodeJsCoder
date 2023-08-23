import { Request, Response } from "express"
import config from "../config/Config"
import ProductService from "../services/ProductService"
import { getUserRole } from "../utils/Utils"
import { CustomProductRequest } from "../middlewares/validators/ProductMw"
import { createResponse } from "../utils/Utils"

const productService = ProductService.getInstance()

export default class ProductController {

    async getProducts(req: CustomProductRequest, res: Response): Promise<any> {
        const { pipeline, options } = req
        const response = await productService.getProducts(pipeline, options)
        const nextPage = response.hasNextPage ?
            `http://localhost:${config.port}/products?page=${response.nextPage}` : null
        const prevPage = response.hasPrevPage ?
            `http://localhost:${config.port}/products?page=${response.prevPage}` : null

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

    async getProductById(req: CustomProductRequest, res: Response): Promise<any> {
        createResponse(res, 201, await productService
            .getProductById(req.params.pid))
    }

    async addProduct(req: Request, res: Response): Promise<any> {
        const data = req.body
        data.owner = getUserRole(req)
        createResponse(res, 201, await productService.addProduct(data))
    }

    async updateProductById(req: Request, res: Response): Promise<any> {
        const userRole = getUserRole(req)
        createResponse(res, 200, await productService
            .updateProductById(req.params.pid, req.body, userRole))
    }

    async deleteProductById(req: Request, res: Response): Promise<any> {
        const userRole = getUserRole(req)
        createResponse(res, 200, await productService
            .deleteProductById(req.params.pid, userRole))
    }

    async deleteAll(req: Request, res: Response): Promise<any> {
        const userRole = getUserRole(req)
        createResponse(res, 200, await productService.deleteAll(userRole))
    }
}
