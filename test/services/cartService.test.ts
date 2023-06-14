import CartService from "../../src/services/CartService"

const cartService = CartService.getInstance()
let carts: any
let cart: any

beforeEach(async () => {
    carts = await cartService.getCarts()
    cart = carts[0]
})

describe('Test Cart Manager with fs', () => {
    it('should create a new Cart and return cartDb length 1', async () => {
        expect(carts.length).toEqual(1)
    })

    it('should return cart when searching cartId', async () => {
        let cartToCheck = await cartService.getCart(cart.id)
        expect(cartToCheck).not.toBeNull
    })

    it('should create a new Cart that has product with quantity 2', async () => {
        await cartService.saveProductToCart(cart.id, "1234")
        await cartService.saveProductToCart(cart.id, "1234")
        let cartProducts: any = await cartService.getCart(cart.id)

        expect(cartProducts.products[0].quantity).toEqual(2)
    })
})