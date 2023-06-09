import request from "supertest"
import express from "express"
import cartsRoute from "../../src/routes/Cart.routes"
import errorHandler from '../../src/config/ErrorConfig'
import CartManager from "../../src/services/CartManager"
import { Cart } from "../../src/entities/ICart"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/api", cartsRoute)
app.use(errorHandler)

const cartPath = "/api/carts/"
const cartManager = CartManager.getInstance()
let carts: any
let cart: Cart

beforeEach(async () => {
    carts = await cartManager.getCarts()
    cart = carts[0]
})

test("get cart by id returns cart", done => {
    request(app)
        .get(cartPath + cart.id)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res: any) => {
            let checkCart = res.body.data
            expect(checkCart.id).toEqual(cart.id)
            done()
        })
})

test("creates new cart and returns cart id", done => {
    request(app)
        .post(cartPath)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res: any) => {
            let cartId = res.body.data
            expect(cartId).not.toBeNull
            done()
        })
})

test("publish product to cart, cart has product", done => {
    request(app)
        .post(cartPath + cart.id + "/product/1234")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(async (err: any, res: any) => {
            if (err) return done(err)

            const updatedCartDb = await request(app).get(cartPath + cart.id)
            const cartWithProducts = updatedCartDb.body.data
            let products = (cartWithProducts.products).filter((prod: any) => prod.id === "1234")

            expect(products[0].quantity).toEqual(1)
            done()
        })
})