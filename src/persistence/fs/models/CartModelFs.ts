import { Cart, CartItem } from "../../../entities/ICart";

export default class CartModelFs implements Cart {
    id?: string
    products: CartItem[]
    totalPrice: number
  
    constructor() {
      this.products = []
      this.totalPrice = 0
    }
}