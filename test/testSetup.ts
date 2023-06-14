import ProductService from '../src/services/ProductService'
import Cartservice from '../src/services/CartService'
import fs from 'fs'
import path from 'path'

const productService = ProductService.getInstance()
const cartService = Cartservice.getInstance()
let dbPath = path.resolve(__dirname, "./testPayload.json")
let database = fs.readFileSync(dbPath, 'utf-8')
const products = JSON.parse(database)

beforeEach(async () => {
    await productService.deleteAll()
    await cartService.deleteAll()
    await productService.addProduct(products[0])
    await productService.addProduct(products[1])
    await productService.addProduct(products[2])
    await cartService.createCart()
})

afterEach(async () => { 
    await productService.deleteAll()
    await cartService.deleteAll()
})