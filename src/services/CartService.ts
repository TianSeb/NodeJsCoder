import DaoFactory from '../persistence/DaoFactory'
import CartRepository from '../persistence/mongo/repository/CartRepository'
import type { Cart } from '../entities/ICart'
import type { Ticket } from '../entities/ITicket'
import type { Product } from '../entities/IProduct'
import { UserRoles } from '../entities/IUser'
import { sendOrderEmail } from '../config/email/email'
import { logger } from '../utils/Logger'
import createError from 'http-errors'

export default class CartService {
  private static instance: CartService | null = null
  private readonly cartManager
  private readonly cartRepository
  private readonly ticketManager
  private readonly productManager

  private constructor() {
    this.cartManager = DaoFactory.getCartManagerInstance()
    this.cartRepository = CartRepository.getInstance()
    this.ticketManager = DaoFactory.getTicketManagerInstance()
    this.productManager = DaoFactory.getProductManagerInstance()
  }

  static getInstance(): CartService {
    if (this.instance === null && this.instance !== undefined) {
      this.instance = new CartService()
    }
    return this.instance
  }

  async createCart(): Promise<Cart> {
    return await this.cartManager.createCart()
  }

  async getCart(cartId: string): Promise<Cart | null> {
    return await this.cartManager.getCart(cartId)
  }

  async getCarts(): Promise<Cart[]> {
    return await this.cartManager.getCarts()
  }

  async saveProductToCart(
    cartId: string,
    productId: string,
    userRole: string
  ): Promise<void> {
    await this.userAllowedToAddProduct(userRole, productId)
    await this.cartManager.saveProductToCart(cartId, productId)
  }

  async purchaseTicket(
    cartId: string,
    userEmail: string
  ): Promise<Ticket | null> {
    const response = await this.cartManager.purchase(cartId, userEmail)
    const { productsForEmail, totalPrice } = response

    const ticket = await this.ticketManager.createTicket(
      totalPrice,
      userEmail,
      productsForEmail
    )
    await sendOrderEmail(userEmail, totalPrice, productsForEmail)
    return ticket
  }

  async deleteCartById(cartId: string): Promise<void> {
    await this.cartManager.deleteCartById(cartId)
  }

  async deleteAll(): Promise<void> {
    await this.cartManager.deleteAll()
  }

  async deleteProductInCart(cartId: string, productId: string): Promise<void> {
    await this.cartManager.deleteProductInCart(cartId, productId)
  }

  async updateCart(cartId: string, data: object): Promise<Cart> {
    const updatedCart = await this.cartManager.updateCart(cartId, data)
    logger.debug(updatedCart)
    return updatedCart
  }

  async updateProductInCart(
    cartId: string,
    productId: string,
    data: object,
    userRole: string
  ): Promise<Cart> {
    await this.userAllowedToAddProduct(userRole, productId)
    return await this.cartManager.updateProductInCart(cartId, productId, data)
  }

  private async userAllowedToAddProduct(
    userRole: string,
    productId: string
  ): Promise<void> {
    const product: Product | null =
      await this.productManager.getProductById(productId)
    if (product === null) {
      throw new createError.NotFound(`Product ${productId} not found`)
    }

    const isNotAuthorized =
      userRole === UserRoles.PREMIUM && product.owner === UserRoles.PREMIUM
    if (isNotAuthorized) {
      throw new createError.NotFound(
        `User not authorized to perform this action`
      )
    }
  }
}
