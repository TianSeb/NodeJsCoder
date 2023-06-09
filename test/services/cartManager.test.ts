import CartManager from "../../src/services/CartManager"

const cartManager = CartManager.getInstance()
let carts: any
let cart: any

beforeEach(async () => {
    carts = await cartManager.getCarts()
    cart = carts[0]
})

describe('Test Cart Manager with fs', () => {
    it('should create a new Cart and return cartDb length 1', async () => {
        expect(carts.length).toEqual(1)
    })

    it('should return cart when searching cartId', async () => {
        let cartToCheck = await cartManager.getCart(cart.id)
        expect(cartToCheck).not.toBeNull
    })

    it('should create a new Cart that has product with quantity 2', async () => {
        await cartManager.saveProductToCart(cart.id, "1234")
        await cartManager.saveProductToCart(cart.id, "1234")
        let cartProducts: any = await cartManager.getCart(cart.id)

        expect(cartProducts.products[0].quantity).toEqual(2)
    })
})