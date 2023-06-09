import DaoFactory from '../dao/DaoFactory'
import { Cart } from '../entities/ICart'

const cartDao = DaoFactory.getCartDaoInstance()
export default class CartManager {
    private static instance: CartManager | null = null

    constructor() {}

    static getInstance(): CartManager {
        if (!CartManager.instance) {
            CartManager.instance = new CartManager()
        }
        return CartManager.instance
    }

    async createCart(): Promise<Cart> {
        let newCart: Cart = await cartDao.createCart()
        return newCart
    }

    async getCart(cartId: string): Promise<Cart | null> {
        const cart: Cart | null = await cartDao.getCart(cartId)
        return cart
    }

    async getCarts(): Promise<Cart[]> {
        return await cartDao.getCarts()
    }

    async saveProductToCart(cartId: string, productId: string): Promise<void> {
        await cartDao.saveProductToCart(cartId, productId)
    }

    async deleteCartById(cartId: string): Promise<void> {
        await cartDao.deleteCartById(cartId)
    }

    async deleteAll(): Promise<void> {
        await cartDao.deleteAll()
    }

    async deleteProductInCart(cartId: string, productId: string): Promise<void> {
        await cartDao.deleteProductInCart(cartId, productId)
    }

    async updateCart(cartId: string, data: any): Promise<Cart> {
        let updatedCart = await cartDao.updateCart(cartId, data)
        return updatedCart
    }

    async updateProductInCart(cartId: string, productId: string, data: any): Promise<Cart> {
        let updatedCart = await cartDao.updateProductInCart(cartId, productId, data)
        return updatedCart
    }
}
