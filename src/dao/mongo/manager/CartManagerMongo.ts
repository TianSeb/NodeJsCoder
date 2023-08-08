import { Types } from "mongoose"
import { CartModel } from "../models/Cart"
import { Cart } from "../../../entities/ICart"
import { CartDao } from "../../interfaces/CartDao"
import MongoDao from "../MongoDao"
import createError from 'http-errors'
import mongoose from "mongoose"
import { ProductModel } from "../models/Product"
import { logger } from "../../../utils/Logger"

export default class CartManagerMongo extends MongoDao<Cart> implements CartDao {

    constructor() {
        super(CartModel)
    }

    async createCart(): Promise<Cart> {
        let newCart = await super.create({ products: [] })
        return newCart
    }

    async getCart(cartId: string): Promise<Cart> {
        const cart = await CartModel.findById(cartId).populate('products.id')
        if (!cart) throw new createError.BadRequest(`Cart not found`)
        return cart
    }

    async getCarts(): Promise<Cart[]> {
        return await super.findAll()
    }

    async saveProductToCart(cartId: string, productId: string): Promise<void> {
        const cart = await super.findById(cartId)
        if (!cart) throw new createError.BadRequest(`Cart not found`)

        const productIndex = cart.products.findIndex((p: any) => p.id.toString() === productId)

        productIndex > -1 ? cart.products[productIndex].quantity += 1 :
            cart.products.push({ id: productId, quantity: 1 })

        const updatedCart = await CartModel.findOneAndUpdate({ _id: cartId }, { products: cart.products })
        logger.info(`Product Saved in Cart: ${updatedCart}`)
    }

    async updateCart(cartId: string, data: any): Promise<Cart> {
        const cart: any = await super.findById(cartId)
        if (!cart) throw new createError.BadRequest(`Cart not found`)

        data.forEach((product: any) => {
            const productIndex = cart.products.findIndex((p: any) => p.id.toString() === product.id.toString())
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = product.quantity
            } else {
                cart.products.push(product)
            }
        })

        await CartModel.findOneAndUpdate({ _id: cartId }, { products: cart.products })
        logger.info(`Cart updated`)
        return cart
    }

    async updateProductInCart(cartId: string, productId: string, data: any): Promise<Cart> {
        const { cart, productIndex } = await this.findProductInCart(cartId, productId)

        cart.products[productIndex].quantity = data.quantity
        await CartModel.findOneAndUpdate({ _id: cartId }, { products: cart.products })
        logger.info(`Product ${productId} updated in Cart`)
        return cart
    }

    private async findProductInCart(cartId: string, productId: string): Promise<any> {
        const cart = await super.findById(cartId)
        if (!cart) throw new createError.BadRequest(`Cart not found`)

        const productIndex = cart.products.findIndex((p: any) => p.id.toString() === productId)
        if (productIndex < 0) throw new createError.BadRequest(`Product not found`)

        return {
            cart,
            productIndex
        }
    }

    async deleteCartById(cartId: any): Promise<number> {
        const deleted = await super.deleteById(cartId)
        if (deleted == 0) {
            throw new createError.BadRequest(`Cart not found`)
        }
        logger.info(`Cart ${cartId} deleted`)
        return deleted
    }

    async deleteAll(): Promise<void> {
        await super.deleteAll()
        logger.info(`Carts deleted`)
    }

    async deleteProductInCart(cartId: string, productId: string): Promise<void> {
        const { cart, productIndex } = await this.findProductInCart(cartId, productId)
        cart.products.splice(productIndex, 1)
        await CartModel.findOneAndUpdate({ _id: cartId }, { products: cart.products })
        logger.info(`Product: ${productId} deleted in Cart`)
    }

    async purchase(cartId: string, userEmail: string): Promise<Cart | any> {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const cart = await CartModel.findById(cartId).populate('products.id')
            if (!cart) throw new createError.BadRequest(`Cart not found`)

            const calculateOrder = this.calculatePurchaseOrder(cart)
            const updateOperations = calculateOrder.updateOperations
            const productsForEmail = calculateOrder.productsForEmail
            let totalPrice = calculateOrder.totalPrice
            
            const result = await ProductModel.bulkWrite(updateOperations, { session })
            if (result.modifiedCount !== cart.products.length) {
                throw createError.NotAcceptable('Out of Stock')
            }
            
            cart.products = []
            await cart.save({ session })

            await session.commitTransaction()
            session.endSession()
            
            logger.info(`Purchase completed successfully for cart ${cart.id}`)
            return {
                userEmail,
                totalPrice,
                productsForEmail
            }
        } catch (error: any) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    }

    private calculatePurchaseOrder(cart: Cart) {
        const updateOperations = []
        const productsForEmail = []
        let totalPrice = 0

        for (const item of cart.products) {
            const product: any = item.id
            const requestedQuantity = item.quantity
            totalPrice += product.price * requestedQuantity

            updateOperations.push({
                updateOne: {
                    filter: { _id: item.id, stock: { $gte: item.quantity } },
                    update: { $inc: { stock: -item.quantity } }
                }
            })
            productsForEmail.push({
                name: product.title,
                qty: requestedQuantity,
                price: product.price,
                total: requestedQuantity * product.price
            })
        }
        return {
            updateOperations,
            productsForEmail,
            totalPrice
        }
    }
}
