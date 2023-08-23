import { PaginateResult } from 'mongoose'
import DaoFactory from "../../DaoFactory"
import { Product } from "../../../entities/IProduct"
import ProductResponseDTO from "../dtos/product/Product.response"
import ProductRegisterDTO from "../dtos/product/Product.register"

export default class ProductRepository {

  private static instance: ProductRepository | null = null
  private productManager

  constructor() {
    this.productManager = DaoFactory.getProductManagerInstance()

  }

  static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository()
    }
    return ProductRepository.instance
  }

  async getProducts(pipeline?: any, options?: any): Promise<PaginateResult<Product> | any> {
    const result = await this.productManager.getProducts(pipeline, options)
    if (result) {
      const newResult = result
      const productsDto: any[] = newResult.docs
        .map((product: Partial<Product>) => new ProductResponseDTO(product))
      newResult.docs = productsDto
      return newResult
    }
    return null
  }

  async getProductById(id: any): Promise<ProductResponseDTO | null> {
    const product = await this.productManager.getProductById(id)
    if (product) {
      const productDTO = new ProductResponseDTO(product)
      return productDTO
    }
    return null
  }

  async createProduct(data: any): Promise<Product> {
    const prodDto = new ProductRegisterDTO(data)
    const response = await this.productManager.addProduct(prodDto)
    return response
  }
}
