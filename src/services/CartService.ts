import DaoFactory from '../persistence/DaoFactory'
import CartRepository from '../persistence/mongo/repository/CartRepository'
import { Cart } from '../entities/ICart'
import { Product } from '../entities/IProduct'
import { UserRoles } from '../entities/IUser'
import { sendOrderEmail } from '../config/email/email'
import { logger } from '../utils/Logger'
import createError from 'http-errors'

export default class CartService {
    private static instance: CartService | null = null
    private cartManager
    private cartRepository
    private ticketManager
    private productManager

    constructor() {
        this.cartManager = DaoFactory.getCartManagerInstance()
        this.cartRepository = CartRepository.getInstance()
        this.ticketManager = DaoFactory.getTicketManagerInstance()
        this.productManager = DaoFactory.getProductManagerInstance()
    }

    static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService()
        }
        return CartService.instance
    }

    async createCart(): Promise<Cart> {
        let newCart: Cart = await this.cartManager.createCart()
        return newCart
    }

    async getCart(cartId: string): Promise<Cart | null> {
        const cart: Cart | null = await this.cartManager.getCart(cartId)
        return cart
    }

    async getCarts(): Promise<Cart[]> {
        return await this.cartManager.getCarts()
    }

    async saveProductToCart(cartId: string, productId: string, userRole: string): Promise<void> {
        await this.userAllowedToAddProduct(userRole, productId)
        await this.cartManager.saveProductToCart(cartId, productId)
    }

    async purchaseTicket(cartId: string, userEmail: string): Promise<any> {
        const response = await this.cartManager.purchase(cartId, userEmail)
        const ticket = await this.ticketManager.createTicket(response.totalPrice, userEmail)
        await sendOrderEmail(userEmail, response.totalPrice, response.productsForEmail)
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

    async updateCart(cartId: string, data: any): Promise<Cart> {
        let updatedCart = await this.cartManager.updateCart(cartId, data)
        logger.debug(updatedCart)
        return updatedCart
    }

    async updateProductInCart(cartId: string, productId: string, data: any, userRole: string): Promise<Cart> {
        await this.userAllowedToAddProduct(userRole, productId)
        let updatedCart = await this.cartManager.updateProductInCart(cartId, productId, data)
        return updatedCart
    }

    private async userAllowedToAddProduct(userRole: string, productId:string): Promise<void> {
        const product: any = await this.productManager.getProductById(productId)
        const isNotAuthorized = userRole === UserRoles.PREMIUM && product.owner === UserRoles.PREMIUM
        if (isNotAuthorized) {
            throw new createError
                .NotFound(`User not authorized to perform this action`)
        }
    }
}
