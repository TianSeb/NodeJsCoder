import { Cart } from "../../entities/ICart"

export interface CartDao {
    createCart(): Promise<Cart>
    getCart(cartId: string): Promise<Cart>
    getCarts(): Promise<Cart[]>
    saveProductToCart(cartId: string, productId: string): Promise<void>
    deleteCartById(cartId: string): Promise<number>
    deleteAll(): Promise<void>
    deleteProductInCart(cartId: string, productId: string): Promise<void>
    updateCart(cartId: string, data: any): Promise<Cart>
    updateProductInCart(cartId: string, productId: string, data: any): Promise<Cart>
    purchase(cartId: string): Promise<Cart | any>
}
