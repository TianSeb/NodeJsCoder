import request from "supertest"
import express from "express"
import productsRoute from "../../src/routes/Product.routes"
import errorHandler from '../../src/config/ErrorConfig'
import ProductService from "../../src/services/ProductService"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/api", productsRoute)
app.use(errorHandler)

const productPath = "/api/products/"
const productService = ProductService.getInstance()
let response: any
let product: any

beforeEach(async () => {
  response = await productService.getProducts()
  product = response.docs[0]
})

test("get products returns product array with length 3", done => {
  request(app)
    .get(productPath)
    .query({ page: 1, limit: 3 })
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res: any) => {
      expect(res.body.data).toHaveLength(3)
      done()
    })
})

test("get products with limit 2 returns product array with length 2", done => {
  request(app)
    .get(productPath)
    .query({ page: 1, limit: 2 })
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res: any) => {
      expect(res.body.data).toHaveLength(2)
      done()
    })
})

test("get Product By Id returns Product", done => {
  request(app)
    .get(productPath + product.id)
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res: any) => {
      expect(res.body.data.title).toEqual(product.title)
      done()
    })
})

test("get Product By Id returns empty", done => {
  request(app)
    .get(productPath + "empty")
    .expect("Content-Type", /json/)
    .expect(400)
    .then((res: any) => {
      expect(res.body.data).toBeUndefined()
      done()
    })
})

test("post product payload creates new product and returns 201", done => {
  request(app)
    .post(productPath)
    .send({
      "title": "Manzana",
      "description": "Este es un producto prueba",
      "code": "abc1234",
      "price": 200,
      "status": true,
      "stock": 25,
      "category": "frutas",
      "thumbnail": ["Sin imagen"]
    })
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(`Request failed with status code ${res.statusCode}. Response body: ${JSON.stringify(res.body)}`)
      } else {
        done()
      }
    })
})

test("post product with no code field returns bad request error", done => {
  request(app)
    .post(productPath)
    .send({
      "title": "mayonesa",
      "description": "postTest",
      "price": 80,
      "stock": 10
    })
    .expect(400, done)
})

test("updating product stock returns 200", done => {
  request(app)
    .put(productPath + product.id)
    .send({
      "stock": 1110
    })
    .expect(200)
    .end(async (err: any, res: any) => {
      if (err) return done(err)

      const updatedProductRes = await request(app).get(productPath + product.id)
      const updatedProduct = updatedProductRes.body.data

      expect(updatedProduct.stock).toBe(1110)
      done()
    })
})

test('deleting product returns 200 and product is removed from db', done => {
  request(app)
    .delete(productPath + product.id)
    .expect(200)
    .end(async (err: any, res: any) => {
      if (err) return done(err)

      const updatedProductDb = await request(app).get(productPath)
      const dbLength = updatedProductDb.body.data.length

      expect(dbLength).toBe(2)
      done()
    })
})

