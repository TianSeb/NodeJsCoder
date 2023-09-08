import type { CartDao } from '../interfaces/CartDao'
import type { Cart, CartItem } from '../../entities/ICart'
import CartModelFs from './models/CartModelFs'
import createError from 'http-errors'
import { v4 as uuidv4 } from 'uuid'
import FsDao from './FsDao'

export default class CartFsDao extends FsDao<Cart> implements CartDao {
  constructor() {
    super('cartTestDb')
  }

  async createCart(): Promise<Cart> {
    const cartDb = await this.getDatabase()
    const newCart: Cart = new CartModelFs()
    newCart.id = uuidv4()
    cartDb.push(newCart)

    await super.save(cartDb)
    return newCart
  }

  async getCart(cartId: string): Promise<Cart> {
    const cartDb = await this.getDatabase()
    const cartFound = await super.objectCodeExists(cartId)
    if (cartFound > -1) {
      return cartDb[cartFound]
    } else {
      throw new createError.BadRequest(`Cart not found`)
    }
  }

  async getCarts(): Promise<Cart[]> {
    const carts = await super.getDatabase()
    return carts
  }

  async saveProductToCart(cartId: string, productId: string): Promise<void> {
    const cartDb = await this.getDatabase()
    const cartIndex = await super.objectCodeExists(cartId)
    if (cartIndex > -1) {
      const oldCart = cartDb[cartIndex]
      const newCart = this.addProductToCart(productId, oldCart)

      cartDb.splice(cartIndex, 1, newCart)
      await super.save(cartDb)
    } else {
      throw new createError.BadRequest(
        `Something went wrong when saving product to cart`
      )
    }
  }

  async deleteCartById(cartId: string): Promise<number> {
    const cartDb = await this.getDatabase()
    const newCartDb = cartDb.filter((c: any) => c.id === cartId)
    await super.save(newCartDb)
    return 1
  }

  async deleteAll(): Promise<void> {
    await super.save([])
  }

  private async addProductToCart(
    productId: string,
    oldCart: Cart
  ): Promise<Cart> {
    const newCart: Cart = new CartModelFs()
    newCart.id = uuidv4()
    const { id, products } = oldCart
    newCart.id = id
    newCart.products = products
    const productIndex = products.findIndex(
      (cartProduct: CartItem) => productId === cartProduct.id
    )

    if (productIndex > -1) {
      const updatedProducts = newCart.products[productIndex]
      updatedProducts.quantity += 1
      newCart.products.splice(productIndex, 1, updatedProducts)
    } else {
      newCart.products.push({ id: productId, quantity: 1 })
    }
    return newCart
  }

  async deleteProductInCart(cartId: string, productId: string): Promise<void> {}

  async updateCart(cartId: string, data: any): Promise<Cart> {
    return new CartModelFs()
  }

  async updateProductInCart(
    cartId: string,
    productId: string,
    data: any
  ): Promise<Cart> {
    return new CartModelFs()
  }

  async purchase(cartId: string, userEmail: string): Promise<void> {}
}
