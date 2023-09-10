import request from 'supertest'
import { getToken, getServer } from './testSetup'

let server: any
let token: string | null = null

beforeAll(async () => {
  token = await getToken()
  server = await getServer()
})

describe('Product Integration Test Suite', () => {
  let productId: string

  it('POST a valid product returns status 201', async () => {
    const response = await request(server.getHttpServer())
      .post('/api/products/')
      .set('Authorization', `Bearer ${token}`)
      .send(bananaProduct)

    expect(response.status).toBe(201)
    expect(response.body.data.title).toBe('banana')
    productId = response.body.data._id
  })

  it('GET product by id returns status 200 ', async () => {
    const response = await request(server.getHttpServer())
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.data.title).toBe('banana')
  })

  it('PUT product returns status 200 and stock 100', async () => {
    const response = await request(server.getHttpServer())
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stock: 100 })

    expect(response.status).toBe(200)
    expect(response.body.data.stock).toBe(100)
  })

  it('DELETE product by id returns 200', async () => {
    const response = await request(server.getHttpServer())
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })
})

const bananaProduct = {
  title: 'banana',
  description: 'Test Product',
  code: 'abc123',
  price: 200,
  status: true,
  stock: 25,
  category: 'Fruits',
  thumbnails: ['Sin imagen']
}
