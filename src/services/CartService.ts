import DaoFactory from '../dao/DaoFactory'
import CartRepository from '../dao/mongo/repository/CartRepository'
import { Cart } from '../entities/ICart'

export default class CartService {
    private static instance: CartService | null = null
    private cartManager
    private cartRepository

    constructor() {
        this.cartManager = DaoFactory.getCartManagerInstance()
        this.cartRepository = CartRepository.getInstance()
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
        const cart: Cart | null = await this.cartRepository.getCartById(cartId)
        return cart
    }

    async getCarts(): Promise<Cart[]> {
        return await this.cartManager.getCarts()
    }

    async saveProductToCart(cartId: string, productId: string): Promise<void> {
        await this.cartManager.saveProductToCart(cartId, productId)
    }

    async purchaseTicket(cartId: string): Promise<any> {

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
        return updatedCart
    }

    async updateProductInCart(cartId: string, productId: string, data: any): Promise<Cart> {
        let updatedCart = await this.cartManager.updateProductInCart(cartId, productId, data)
        return updatedCart
    }
}
