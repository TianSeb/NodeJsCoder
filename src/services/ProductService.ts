/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import mongoose from 'mongoose'
import type { PaginateResult } from 'mongoose'
import DaoFactory from '../persistence/DaoFactory'
import ProductRepository from '../persistence/mongo/repository/ProductRepository'
import type { Product } from '../entities/IProduct'
import { UserRoles } from '../entities/IUser'
import { sendSocketMessage } from '../socket/SocketClient'
import createError from 'http-errors'
import { logger } from '../utils/Logger'
import { sendProductDeletedEmail } from '../config/email/email'

export default class ProductService {
  private static instance: ProductService | null = null
  private readonly productManager
  private readonly productRepository

  private constructor() {
    this.productManager = DaoFactory.getProductManagerInstance()
    this.productRepository = ProductRepository.getInstance()
  }

  static getInstance(): ProductService {
    if (this.instance === null && this.instance !== undefined) {
      this.instance = new ProductService()
    }
    return this.instance
  }

  async addProduct(data: any): Promise<Product> {
    try {
      const savedProduct = await this.productManager.addProduct(data)
      sendSocketMessage('productSaved', savedProduct)
      logger.debug(`Product saved: ${JSON.stringify(savedProduct)}`)
      return savedProduct
    } catch (error: any) {
      logger.error(`error adding product ${error.message}`)
      if (error instanceof mongoose.Error.ValidationError) {
        throw new createError.BadRequest(error.message)
      } else if (error.code === 11000) {
        throw new createError.BadRequest('Product code is already in use')
      } else {
        throw new createError.InternalServerError(error.message)
      }
    }
  }

  async getProducts(
    pipeline?: any,
    options?: any
  ): Promise<PaginateResult<Product> | any> {
    return await this.productRepository.getProducts(pipeline, options)
  }

  async getProductById(id: any): Promise<Product> {
    const product = await this.productManager.getProductById(id) // this.productRepository.getProductById(id)
    if (product != null) {
      logger.debug(`Found product with id: ${product._id}`)
      return product
    } else {
      logger.debug(`product ${id} not found`)
      throw new createError.NotFound(`Product ${id} not found`)
    }
  }

  async deleteProductById(id: any, userRole: string): Promise<void> {
    const product = await this.getProductById(id)
    this.validateUserRole(userRole, product)
    const deleted = await this.productManager.deleteProductById(id)
    await this.sendMailWhenPremiumProductIsDeleted(product)
    if (deleted === 1) {
      sendSocketMessage('productDeleted', id)
      logger.debug(`product with id: ${id} deleted`)
    } else {
      throw new createError.NotFound(`Product ${id} not found`)
    }
  }

  async deleteAll(userRole: string): Promise<void> {
    if (userRole === UserRoles.PREMIUM) {
      throw new createError.NotFound(
        `User not authorized to perform this action`
      )
    }
    await this.productManager.deleteAll()
  }

  async updateProductById(
    prodId: string,
    updatedFields: Partial<Product>,
    userRole: string
  ): Promise<Product> {
    try {
      const product = await this.getProductById(prodId)
      this.validateUserRole(userRole, product)

      const udpatedProduct = await this.productManager.updateProductById(
        prodId,
        updatedFields
      )
      sendSocketMessage('productSaved', udpatedProduct)

      return udpatedProduct
    } catch (error: any) {
      throw new createError.NotFound(error.message)
    }
  }

  private validateUserRole(userRole: string, product: Product): void {
    const isUserAuthorized =
      userRole === UserRoles.ADMIN ||
      (userRole === UserRoles.PREMIUM &&
        product.ownerRole === UserRoles.PREMIUM)
    if (!isUserAuthorized) {
      throw new createError.NotFound(
        `User not authorized to perform this action`
      )
    }
  }

  private async sendMailWhenPremiumProductIsDeleted(
    product: Product
  ): Promise<void> {
    if (product.ownerRole === UserRoles.PREMIUM) {
      await sendProductDeletedEmail(
        product.userEmail ?? 'null',
        product.title,
        product.code
      )
    }
  }

  buildProductQueryPipeline(category: any, status: any, sort: any): any[] {
    const parsedStatus = status === 'true'
    const pipeline: any[] = []

    if (category) {
      pipeline.push({
        $match: {
          // eslint-disable-next-line object-shorthand
          category: category
        }
      })
    }

    if (status !== undefined) {
      pipeline.push({
        $match: {
          status: parsedStatus
        }
      })
    }

    if (sort) {
      const sortOrder = parseInt(sort)
      pipeline.push({
        $sort: {
          price: sortOrder
        }
      })
    }
    logger.debug(`pipeline: ${JSON.stringify(pipeline)}`)
    return pipeline
  }
}
