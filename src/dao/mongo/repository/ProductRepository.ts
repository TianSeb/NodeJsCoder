import DaoFactory from "../../DaoFactory"
import { Product } from "../../../entities/IProduct"
import ProductResponseDTO from "../dtos/product/Product.response"
import ProductRegisterDTO from "../dtos/product/Product.register"

const productDao = DaoFactory.getProductManagerInstance()

export default class ProductRepository {

  private static instance: ProductRepository | null = null

  constructor() {}

  static getInstance(): ProductRepository {
      if (!ProductRepository.instance) {
        ProductRepository.instance = new ProductRepository()
      }
      return ProductRepository.instance
  }

  async getProductById(id: any): Promise<ProductResponseDTO | null> {
    const product = await productDao.getProductById(id)
    if (product) {
      const productDTO = new ProductResponseDTO(product)
      return productDTO
    }
    return null
  }

  async createProduct(data: any): Promise<Product> {
    const prodDto = new ProductRegisterDTO(data)
    const response = await productDao.addProduct(prodDto)
    return response
  } 
}
