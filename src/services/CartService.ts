import DaoFactory from '../dao/DaoFactory'
import CartRepository from '../dao/mongo/repository/CartRepository'
import { Cart } from '../entities/ICart'
import { sendOrderEmail } from '../config/email/email'

export default class CartService {
    private static instance: CartService | null = null
    private cartManager
    private cartRepository
    private ticketManager

    constructor() {
        this.cartManager = DaoFactory.getCartManagerInstance()
        this.cartRepository = CartRepository.getInstance()
        this.ticketManager = DaoFactory.getTicketManagerInstance()
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

    async saveProductToCart(cartId: string, productId: string): Promise<void> {
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
        console.log(updatedCart)
        return updatedCart
    }

    async updateProductInCart(cartId: string, productId: string, data: any): Promise<Cart> {
        let updatedCart = await this.cartManager.updateProductInCart(cartId, productId, data)
        return updatedCart
    }
}
