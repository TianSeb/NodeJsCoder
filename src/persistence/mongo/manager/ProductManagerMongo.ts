import createError from 'http-errors'
import MongoDao from '../MongoDao'
import type { PaginateResult, Aggregate } from 'mongoose'
import { ProductModel } from '../models/Product'
import type { Product } from '../../../entities/IProduct'
import type { ProductDao } from '../../interfaces/ProductDao'
import { logger } from '../../../utils/Logger'

export default class ProductManagerMongo
  extends MongoDao<Product>
  implements ProductDao
{
  constructor() {
    super(ProductModel)
  }

  async addProduct(data: any): Promise<Product> {
    return await super.create(data)
  }

  async getProducts(
    pipeline?: any,
    options?: any
  ): Promise<PaginateResult<Product> | any> {
    const agregattion: Aggregate<any[]> = ProductModel.aggregate(pipeline)

    const totalPageCount = await this.getProductTotalPageCount(
      pipeline,
      options.limit
    )
    if (options.page > totalPageCount) {
      throw new createError.NotFound('Page not found')
    }

    const result = await ProductModel.aggregatePaginate(agregattion, options)
    return result
  }

  async getProductById(id: any): Promise<Product | null> {
    return await super.findById(id)
  }

  async deleteProductById(id: any): Promise<number> {
    return await super.deleteById(id)
  }

  async deleteAll(): Promise<void> {
    await super.deleteAll()
  }

  async updateProductById(
    prodId: string,
    updatedFields: Partial<Product>
  ): Promise<Product> {
    await ProductModel.findOneAndUpdate({ _id: prodId }, updatedFields)
    const product = await super.findById(prodId)

    if (product === null) {
      throw new createError.NotFound(`Product with id ${prodId} not found`)
    }
    logger.debug(`Updated Product: ${JSON.stringify(product)}`)
    return product
  }

  private readonly getProductTotalPageCount = async (
    pipeline: any,
    limit: number
  ): Promise<number> => {
    const totalProductCount = await ProductModel.countDocuments(pipeline)
    const totalPages = Math.ceil(totalProductCount / limit)
    return totalPages
  }
}
