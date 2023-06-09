import { Product } from "../../entities/IProduct"
import { ProductDao } from "../interfaces/ProductDao"
import ProductModelFs from "./models/ProductModelFs"
import createError from 'http-errors'
import { v4 as uuidv4 } from 'uuid'
import FsDao from "./FsDao"

export default class ProductFsDao extends FsDao<Product> implements ProductDao {

    constructor() {
        super("productTestDb")
    }

    async addProduct(data: any) {
        let products = await super.getDatabase()
        let product: Product = new ProductModelFs(data)
        product.id = uuidv4()
        let productIndex = await super.objectCodeExists(product)

        if (productIndex < 0) {
            products.push(product)
            await super.save(products)
            return product
        } else {
            throw new createError.BadRequest('Product code is already in use')
        }
    }

    async getProducts(pipeline?:any, options?:any) {
        let parsedPage, parsedLimit
        if (options) {
        parsedPage = options.parsedPage || 1
        parsedLimit = options.parsedLimit || 10
        }

        let products = await super.getDatabase()
        if (products) {
            return {
                docs: products.slice(0,parsedLimit),
                totalDocs: products.length,
                totalPages: parsedPage,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null
              }
        } else {
            throw new createError.BadRequest('Products not found')
        }
    }

    async getProductById(id: any) {
        let products = await super.getDatabase()
        let result = products.find((product: any) => product.id === id)

        if (result) {
            return result
        } else {
            throw new createError.BadRequest(`Product ${id} not found`)
        }
    }

    async deleteProductById(id: any): Promise<number> {
        let products = await super.getDatabase()
        let index = products.findIndex((product: Product) => product.id === id)

        if (index > -1) {
            products.splice(index, 1)
            await super.save(products)
            return 1
        } else {
            throw new createError.BadRequest(`Product ${id} not found`)
        }
    }

    async deleteAll(): Promise<void> {
        try {
            await super.save([])
        } catch (error) {
            throw new createError[401](`Error deleting products database`)
        }
    }

    async updateProductById(prodId: string, updatedFields: Partial<Product>) {
        let response = await this.getProducts()
        let foundProductIndex = response.docs.findIndex((prod: any) => prod.id === prodId)

        if (foundProductIndex > -1) {
            let productToUpdate = response.docs[foundProductIndex]
            this.validateProductFields(productToUpdate, updatedFields)

            let { id, ...rest } = updatedFields
            let updatedProduct = { ...productToUpdate, ...rest }

            response.docs.splice(foundProductIndex, 1, updatedProduct)
            await super.save(response.docs)

            return updatedProduct
        } else {
            throw new createError.BadRequest(`Product with id ${prodId} not found`)
        }
    }

    private validateProductFields(product: Product, updatedFields: any) {
        const allowedFields = Object.keys(product)
        let fieldsName = Object.keys(updatedFields)

        fieldsName.forEach((field: any): any => {
            if (!allowedFields.includes(field) || field === "id" || field === "_id") {
                throw new createError.BadRequest(`Invalid field: ${field}`)
            }
        })
    }
}