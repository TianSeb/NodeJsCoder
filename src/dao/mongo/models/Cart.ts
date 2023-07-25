import { Schema, model, Types } from "mongoose"
import { CartItem, Cart } from "../../../entities/ICart"

const cartProductSchema = new Schema<CartItem>({
    id: { 
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: { type: Number, required: false }
}, { _id: false, versionKey: false })

const cartSchema = new Schema<Cart>({
    products: [cartProductSchema],
    totalPrice: { type: Number, required: false, default: 0 }
}, { versionKey: false })

cartSchema
  .virtual('productsData', {
    ref: 'Product',
    localField: 'products',
    foreignField: '_id',
    justOne: false,
})

export const CartModel = model<Cart>('Cart', cartSchema)
