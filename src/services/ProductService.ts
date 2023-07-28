import mongoose, { PaginateResult } from 'mongoose'
import DaoFactory from '../dao/DaoFactory'
import ProductRepository from '../dao/mongo/repository/ProductRepository'
import { Product } from '../entities/IProduct'
import ProductResponseDTO from '../dao/mongo/dtos/product/Product.response'
import { sendSocketMessage } from '../socket/SocketClient'
import createError from 'http-errors'

export default class ProductService {
    private static instance: ProductService | null = null
    private productManager
    private productRepository

    constructor() {
        this.productManager = DaoFactory.getProductManagerInstance()
        this.productRepository = ProductRepository.getInstance()
    }

    static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService()
        }
        return ProductService.instance
    }
    
    async addProduct(data: any): Promise<Product> {
        try {
            const savedProduct = await this.productManager.addProduct(data)
            sendSocketMessage("productSaved", savedProduct)
            return savedProduct

        } catch (error: any) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new createError.BadRequest(error.message);
            } else if (error.code === 11000) {
                throw new createError.BadRequest('Product code is already in use');
            } else {
                throw new createError.InternalServerError(error.message);
            }
        }
    }

    async getProducts(pipeline?:any, options?:any): Promise<PaginateResult<Product> | any> {
        return await this.productRepository.getProducts(pipeline, options)
    }

    async getProductById(id: any): Promise<Product> {
        const product = await this.productManager.getProductById(id)  // this.productRepository.getProductById(id)
        if (product != null) {
            return product
        } else {
            throw new createError.NotFound(`Product ${id} not found`);
        }
    }

    async deleteProductById(id: any): Promise<void> {
        const deleted = await this.productManager.deleteProductById(id)
        if (deleted === 1) {
            sendSocketMessage("productDeleted", id)
        } else {
            throw new createError.NotFound(`Product ${id} not found`)
        }
    }

    async deleteAll(): Promise<void> {
        await this.productManager.deleteAll()
    }

    async updateProductById(prodId: string, updatedFields: Partial<Product>): Promise<Product> {
        try {
            let product = await this.productManager.updateProductById(prodId, updatedFields)
            sendSocketMessage("productSaved", product)
    
            return product
        } catch (error:any) {
            throw new createError.NotFound(error.message)
        }
    }

    buildProductQueryPipeline(category: any, status: any, sort: any): any[] {
        const parsedStatus = status === 'true'
        const pipeline: any[] = []
      
        if (category) {
          pipeline.push({
            $match: {
              category: category,
            },
          })
        }
      
        if (status !== undefined) {
          pipeline.push({
            $match: {
              status: parsedStatus,
            },
          })
        }
      
        if (sort) {
          const sortOrder = parseInt(sort)
          pipeline.push({
            $sort: {
              price: sortOrder,
            },
          })
        }
        return pipeline
    }
}
