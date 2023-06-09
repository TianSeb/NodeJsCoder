import { Types } from "mongoose"

export interface CartItem {
    id: Types.ObjectId | string
    quantity: number
}

export interface Cart {
    id?: string
    products: CartItem[]
    totalPrice: number
}
