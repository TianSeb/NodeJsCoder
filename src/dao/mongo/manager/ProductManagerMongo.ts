import createError from 'http-errors'
import MongoDao from "../MongoDao"
import { PaginateResult, Aggregate } from 'mongoose'
import { ProductModel } from "../models/Product"
import { Product } from "../../../entities/IProduct"
import { ProductDao } from "../../interfaces/ProductDao"

export default class ProductManagerMongo extends MongoDao<Product> implements ProductDao {

    constructor() {
        super(ProductModel)
    }

    async addProduct(data: any): Promise<Product> {
        return super.create(data)
    }

    async getProducts(pipeline?:any, options?:any): Promise<PaginateResult<Product> | any> {
        let agregattion: Aggregate<any[]> = ProductModel.aggregate(pipeline)

        const totalPageCount = await this.getProductTotalPageCount(pipeline, options.limit)
        if (options.page > totalPageCount) {
          throw new createError.NotFound('Page not found')
        }
     
        let result = await ProductModel.aggregatePaginate(agregattion, options)
        return result
    }

    async getProductById(id: any): Promise<Product | null> {
        return super.findById(id)
    }

    async deleteProductById(id: any): Promise<number> {
        return super.deleteById(id)
    }

    async deleteAll(): Promise<void> {
        super.deleteAll()
    }

    async updateProductById(prodId: string, updatedFields: Partial<Product>): Promise<Product> {
        await ProductModel.findOneAndUpdate({ _id: prodId }, updatedFields)
        const product = await super.findById(prodId)

        if (!product) {
            throw new createError.NotFound(`Product with id ${prodId} not found`)
        }
        return product
    }

    private getProductTotalPageCount = async (pipeline: any, limit: number): Promise<number> => {
        const totalProductCount = await ProductModel.countDocuments(pipeline)
        const totalPages = Math.ceil(totalProductCount / limit)
        return totalPages
    }
}
