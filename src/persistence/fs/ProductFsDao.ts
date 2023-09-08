import type { Product } from '../../entities/IProduct'
import type { ProductDao } from '../interfaces/ProductDao'
import ProductModelFs from './models/ProductModelFs'
import createError from 'http-errors'
import { v4 as uuidv4 } from 'uuid'
import FsDao from './FsDao'

export default class ProductFsDao extends FsDao<Product> implements ProductDao {
  constructor() {
    super('productTestDb')
  }

  async addProduct(data: any): Promise<Product> {
    const products = await super.getDatabase()
    const product: Product = new ProductModelFs(data)
    product._id = uuidv4()
    const productIndex = await super.objectCodeExists(product)

    if (productIndex < 0) {
      products.push(product)
      await super.save(products)
      return product
    } else {
      throw new createError.BadRequest('Product code is already in use')
    }
  }

  async getProducts(pipeline?: any, options?: any): Promise<object> {
    let parsedPage, parsedLimit
    if (options !== null) {
      parsedPage = options.page ?? 1
      parsedLimit = options.limit ?? 10
    }

    const products = await super.getDatabase()
    if (options !== null) {
      return {
        docs: products.slice(0, parsedLimit),
        totalDocs: products.length,
        totalPages: parsedPage,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
      }
    } else {
      throw new createError.BadRequest('Products not found')
    }
  }

  async getProductById(id: any): Promise<any> {
    const products = await super.getDatabase()
    const result = products.find((product: any) => product.id === id)

    if (result !== null) {
      return result
    } else {
      throw new createError.BadRequest(`Product ${id} not found`)
    }
  }

  async deleteProductById(id: any): Promise<number> {
    const products = await super.getDatabase()
    const index = products.findIndex((product: Product) => product._id === id)

    if (index > -1) {
      products.splice(index, 1)
      await super.save(products)
      return 1
    } else {
      throw new createError.BadRequest(`Product ${id} not found`)
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await super.save([])
    } catch (error) {
      throw new createError[401](`Error deleting products database`)
    }
  }

  async updateProductById(
    prodId: string,
    updatedFields: Partial<Product>
  ): Promise<Product> {
    const response: any = await this.getProducts()
    const foundProductIndex = response.docs.findIndex(
      (prod: any) => prod.id === prodId
    )

    if (foundProductIndex > -1) {
      const productToUpdate = response.docs[foundProductIndex]
      this.validateProductFields(productToUpdate, updatedFields)

      const { _id, ...rest } = updatedFields
      const updatedProduct = { ...productToUpdate, ...rest }

      response.docs.splice(foundProductIndex, 1, updatedProduct)
      await super.save(response.docs)

      return updatedProduct
    } else {
      throw new createError.BadRequest(`Product with id ${prodId} not found`)
    }
  }

  private validateProductFields(product: Product, updatedFields: any): void {
    const allowedFields = Object.keys(product)
    const fieldsName = Object.keys(updatedFields)

    fieldsName.forEach((field: any): any => {
      if (!allowedFields.includes(field) || field === 'id' || field === '_id') {
        throw new createError.BadRequest(`Invalid field: ${field}`)
      }
    })
  }
}
