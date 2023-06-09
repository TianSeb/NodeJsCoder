import ProductManager from '../src/services/ProductManager'
import CartManager from '../src/services/CartManager'
import fs from 'fs'
import path from 'path'

const productManager = ProductManager.getInstance()
const cartManager = CartManager.getInstance()
let dbPath = path.resolve(__dirname, "./testPayload.json")
let database = fs.readFileSync(dbPath, 'utf-8')
const products = JSON.parse(database)

beforeEach(async () => {
    await productManager.deleteAll()
    await cartManager.deleteAll()
    await productManager.addProduct(products[0])
    await productManager.addProduct(products[1])
    await productManager.addProduct(products[2])
    await cartManager.createCart()
})

afterEach(async () => { 
    await productManager.deleteAll()
    await cartManager.deleteAll()
})