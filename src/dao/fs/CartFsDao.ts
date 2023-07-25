import { CartDao } from "../interfaces/CartDao"
import { Cart, CartItem } from "../../entities/ICart"
import CartModelFs from "./models/CartModelFs"
import createError from 'http-errors'
import { v4 as uuidv4 } from 'uuid'
import FsDao from "./FsDao"

export default class CartFsDao extends FsDao<Cart> implements CartDao {
    
    constructor() {
        super("cartTestDb")
    }

    async createCart(): Promise<Cart> {
        let cartDb = await this.getDatabase()
        let newCart: Cart = new CartModelFs()
        newCart.id = uuidv4()
        cartDb.push(newCart)

        await super.save(cartDb)
        return newCart
    }

    async getCart(cartId: string): Promise<Cart> {
        let cartDb = await this.getDatabase()
        let cartFound = await super.objectCodeExists(cartId)
        if (cartFound > -1) {
            return cartDb[cartFound]
        } else {
            throw new createError.BadRequest(`Cart not found`)
        }
    }

    async getCarts(): Promise<Cart[]> {
        let carts = await super.getDatabase()
        return carts
    }

    async saveProductToCart(cartId: string, productId: string): Promise<void> {
        let cartDb = await this.getDatabase()
        let cartIndex = await super.objectCodeExists(cartId)
        if (cartIndex > -1) {
            let oldCart = cartDb[cartIndex]
            let newCart = this.addProductToCart(productId, oldCart)

            cartDb.splice(cartIndex, 1, newCart)
            await super.save(cartDb)
        } else {
            throw new createError.BadRequest(`Something went wrong when saving product to cart`)
        }
    }

    async deleteCartById(cartId: string): Promise<number> {
        let cartDb = await this.getDatabase()
        let newCartDb = cartDb.filter((c: any) => c.id === cartId)
        await super.save(newCartDb)
        return 1
    }

    async deleteAll(): Promise<void> {
        await super.save([])
    }

    private addProductToCart(productId: string, oldCart: Cart) {
        let newCart: Cart = new CartModelFs()
        newCart.id = uuidv4()
        let { id, products } = oldCart
        newCart.id = id
        newCart.products = products
        let productIndex = products.findIndex((cartProduct: CartItem) => productId === cartProduct.id)

        if (productIndex > -1) {
            let updatedProducts = newCart.products[productIndex]
            updatedProducts.quantity += 1
            newCart.products.splice(productIndex, 1, updatedProducts)
        } else {
            newCart.products.push({ "id": productId, "quantity": 1 })
        }
        return newCart
    }

    async deleteProductInCart(cartId: string, productId: string): Promise<void> {
    }

    async updateCart(cartId: string, data: any): Promise<Cart> {
        return new CartModelFs()
    }

    async updateProductInCart(cartId: string, productId: string, data: any): Promise<Cart> {
        return new CartModelFs()
    }

    async purchase(cartId: string) {
    }
}