import ProductManager from '../../src/services/ProductManager'
import { Product } from '../../src/entities/IProduct'

const productManager = ProductManager.getInstance()
let response: any
let product: any

beforeEach(async () => {
    response = await productManager.getProducts()
    product = response.docs[0]
})

describe('Test Product Manager with fs', () => {

    it('addProduct is added to products[] with autogenerated id', async () => {
        expect(product.id).not.toBeNull()
        expect(product.id).not.toBeUndefined()
    })

    it('getProducts returns products[] with size 3', async () => {       
        expect(response.docs.length).toEqual(3)
    })

    it('addProduct returns error when creating product with same code', async () => {
        await expect(async () => await productManager.addProduct(product))
                        .rejects.toThrowError("Product code is already in use")
    })

    it('getProductById returns product with valid id', async () => {
        for (const product of response.docs) {
            let productTitle: Product = await productManager.getProductById(product.id)
            expect(productTitle.title).toEqual(product.title)
        }
    })

    it('getProductById returns error not found when id does not exist', async () => {
        await expect(productManager.getProductById("asdggjhk")).rejects
            .toThrowError(`Product asdggjhk not found`)
    })

    it('deleteById() deletes Product and getAll().length = 2 ', async () => {
        await productManager.deleteProductById(product.id)

        const expected = 2
        const result: any = await productManager.getProducts()
        await expect(result.docs.length).toBe(expected)
    })

    it('deleteAll() returns empty array after deleting all products', async () => {
        await productManager.deleteAll()

        const expected = 0
        const result: any = await productManager.getProducts()
        expect(result.docs.length).toBe(expected)
    })

    it('updateProductById() updates product stock', async () => {
        let fieldsToUpdate = {
            stock: 5
        }
        await productManager.updateProductById(product.id, fieldsToUpdate)

        let productUpdated: any = await productManager.getProductById(product.id)

        await expect(productUpdated.stock).toEqual(5)
    })

    it('updateProductById() returns error when trying to modify id', async () => {
        let fieldsToUpdate = {
            id: "5"
        }

        let prodId = product.id

        await expect(productManager.updateProductById(prodId, fieldsToUpdate))
            .rejects
            .toThrowError('Invalid field: id')
    })

    it('updateProductById() returns error when using invalid id', async () => {
        let fieldsToUpdate = {
            stock: 5
        }

        await expect(productManager.updateProductById("5555", fieldsToUpdate))
            .rejects
            .toThrowError('Product with id 5555 not found')
    })
})

