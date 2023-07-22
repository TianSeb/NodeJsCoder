import DaoFactory from "../../DaoFactory"
import { Cart } from "../../../entities/ICart"
import ProductResponseDTO from "../dtos/product/Product.response"

export default class CartRepository {

  private static instance: CartRepository | null = null
  private cartDao;

  constructor() { 
    this.cartDao = DaoFactory.getCartManagerInstance()

  }

  static getInstance(): CartRepository {
    if (!CartRepository.instance) {
      CartRepository.instance = new CartRepository()
    }
    return CartRepository.instance
  }

  async getCartById(id: any): Promise<Cart | null> {
    const cart = await this.cartDao.getCart(id)
    if (cart) {
      const productsDto: any[] = cart.products.map((product: any) => ({
        product: new ProductResponseDTO(product.id),
        quantity: product.quantity
      }))
      return {
        id: cart.id,
        products: productsDto,
        totalPrice: cart.totalPrice
      }
    }
    return null
  }
}
