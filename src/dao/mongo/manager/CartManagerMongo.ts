import { Types } from "mongoose"
import { CartModel } from "../models/Cart"
import { Cart } from "../../../entities/ICart"
import { CartDao } from "../../interfaces/CartDao"
import MongoDao from "../MongoDao"
import createError from 'http-errors'
import mongoose from "mongoose"
import { ProductModel } from "../models/Product"

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

        await CartModel.findOneAndUpdate({ _id: cartId }, { products: cart.products })
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
        return cart
    }

    async updateProductInCart(cartId: string, productId: string, data: any): Promise<Cart> {
        const { cart, productIndex } = await this.findProductInCart(cartId, productId)

        cart.products[productIndex].quantity = data.quantity
        await CartModel.findOneAndUpdate({ _id: cartId }, { products: cart.products })
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
        return deleted
    }

    async deleteAll(): Promise<void> {
        await super.deleteAll()
    }

    async deleteProductInCart(cartId: string, productId: string): Promise<void> {
        const { cart, productIndex } = await this.findProductInCart(cartId, productId)
        cart.products.splice(productIndex, 1)
        await CartModel.findOneAndUpdate({ _id: cartId }, { products: cart.products })
    }

    async purchase(cartId: string): Promise<Cart | any> {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const cart = await this.getCart(cartId)
            const updateOperations = []

            for (const item of cart.products) {
                const product: any = item.id
                const requestedQuantity = item.quantity
                cart.totalPrice += product.price * requestedQuantity

                updateOperations.push({
                    updateOne: {
                        filter: { _id: item.id, stock: { $gte: item.quantity } },
                        update: { $inc: { stock: -item.quantity } }
                    }
                })
            }
            const result = await ProductModel.bulkWrite(updateOperations, { session })

            if (result.modifiedCount !== cart.products.length) {
                throw createError.NotAcceptable('Out of Stock')
            }

            await session.commitTransaction()
            session.endSession()
            console.log(`Purchase completed successfully for cart ${cart.id}`)
            return cart
        } catch (error: any) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    }
}
