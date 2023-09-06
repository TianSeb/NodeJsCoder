import Server from '../../src/Server'
import { initDbConnection } from '../../src/persistence/DbConnection'
import UserService from '../../src/services/UserService'
import request from "supertest"

const server: Server = new Server()
const userService: UserService = UserService.getInstance()
let token: any

beforeAll(async () => {
    await initDbConnection()
    token = await userService.loginUser({
        "email": "elGordoBonza@motoneta.com",
        "password": "1234"
    })
})

describe('Cart Integration Test Suite', () => {

    const cartPath = '/api/carts/'
    const cartProductId: string = '64f0e1108d0ccd3643d4f3a9'
    let cartId: string

    it('POST create cart returns status 201', async () => {
        const response = await request(server.getHttpServer())
            .post(cartPath)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(201)
        expect(response.body.data.products).toStrictEqual([])
        expect(response.body.data.totalPrice).toBe(0)
        cartId = response.body.data._id
    })

    it('POST add product to cart returns status 201', async () => {
        const path = cartPath + cartId + '/product/' + cartProductId
        const response = await request(server.getHttpServer())
            .post(path)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(201)
    })

    it('GET cart by id returns cart with cartProduct, quantity 1 and status 200', async () => {
        const response = await request(server.getHttpServer())
            .get(cartPath + cartId)
            .set('Authorization', `Bearer ${token}`)

        const products = response.body.data.products[0]
        expect(response.status).toBe(200)
        expect(products.quantity).toBe(1)
        expect(products.id._id).toEqual(cartProductId)
    })

    it('PUT cart by id updates product quantity to 2 and return status 200', async () => {
        const path = cartPath + cartId + '/product/' + cartProductId
        const response = await request(server.getHttpServer())
            .put(path)
            .set('Authorization', `Bearer ${token}`)
            .send({ "quantity": 2 })

        const cart = response.body.data.products[0]
        expect(response.status).toBe(200)
        expect(cart.quantity).toBe(2)
        expect(cart.id).toEqual(cartProductId)
    })

    it('DELETE cart by id returns status 200', async () => {
        const response = await request(server.getHttpServer())
            .get(cartPath + cartId)
            .set('Authorization', `Bearer ${token}`)
        
        const products = response.body.data.products[0]
        expect(response.status).toBe(200)
        expect(products.quantity).toBe(2)
        expect(products.id._id).toEqual(cartProductId)
    })
})