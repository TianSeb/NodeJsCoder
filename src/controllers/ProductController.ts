import type { Request, Response } from 'express'
import config from '../config/Config'
import ProductService from '../services/ProductService'
import { getUserRoleAndMail, createResponse } from '../utils/Utils'
import type { CustomProductRequest } from '../middlewares/validators/ProductMw'
import { logger } from '../utils/Logger'
import type { Product } from '../entities/IProduct'

const productService = ProductService.getInstance()

export default class ProductController {
  async getProducts(req: CustomProductRequest, res: Response): Promise<any> {
    const { pipeline, options } = req
    const response = await productService.getProducts(pipeline, options)
    const nextPage =
      response.hasNextPage !== undefined && response.hasNextPage !== null
        ? `http://localhost:${config.port}/products?page=${response.nextPage}`
        : null
    const prevPage =
      response.prevPage !== undefined && response.prevPage !== null
        ? `http://localhost:${config.port}/products?page=${response.prevPage}`
        : null

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
    createResponse(
      res,
      200,
      await productService.getProductById(req.params.pid)
    )
  }

  async addProduct(req: Request, res: Response): Promise<any> {
    const data: Product = req.body
    const { ownerRole, userEmail } = getUserRoleAndMail(req.user)
    data.ownerRole = ownerRole
    data.userEmail = userEmail
    logger.debug(
      `user ${userEmail} with role ${ownerRole} is creating product ${data.title}`
    )
    createResponse(res, 201, await productService.addProduct(data))
  }

  async updateProductById(req: Request, res: Response): Promise<any> {
    const { ownerRole } = getUserRoleAndMail(req.user)
    createResponse(
      res,
      200,
      await productService.updateProductById(
        req.params.pid,
        req.body,
        ownerRole
      )
    )
  }

  async deleteProductById(req: Request, res: Response): Promise<any> {
    const { ownerRole, userEmail } = getUserRoleAndMail(req.user)
    logger.info(
      `User: ${userEmail} with role: ${ownerRole} is trying to delete product ${req.params.pid}`
    )

    await productService.deleteProductById(req.params.pid, ownerRole)
    createResponse(
      res,
      200,
      `Product with id: ${req.params.pid} has been deleted`
    )
  }

  async deleteAll(req: Request, res: Response): Promise<any> {
    const { ownerRole } = getUserRoleAndMail(req.user)
    await productService.deleteAll(ownerRole)
    createResponse(res, 200, 'All products have been deleted')
  }
}
