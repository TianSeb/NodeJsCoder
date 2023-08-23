import mongoose, { PaginateResult } from 'mongoose'
import DaoFactory from '../persistence/DaoFactory'
import ProductRepository from '../persistence/mongo/repository/ProductRepository'
import { Product } from '../entities/IProduct'
import { UserRoles } from '../entities/IUser'
import { sendSocketMessage } from '../socket/SocketClient'
import createError from 'http-errors'
import { logger } from '../utils/Logger'

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
            logger.debug("Product saved")
            return savedProduct

        } catch (error: any) {
            logger.error(`error adding product ${error.message}`)
            if (error instanceof mongoose.Error.ValidationError) {
                throw new createError.BadRequest(error.message);
            } else if (error.code === 11000) {
                throw new createError.BadRequest('Product code is already in use');
            } else {
                throw new createError.InternalServerError(error.message);
            }
        }
    }

    async getProducts(pipeline?: any, options?: any): Promise<PaginateResult<Product> | any> {
        return await this.productRepository.getProducts(pipeline, options)
    }

    async getProductById(id: any): Promise<Product> {
        const product = await this.productManager.getProductById(id)  // this.productRepository.getProductById(id)
        if (product != null) {
            return product
        } else {
            logger.debug(`product ${id} not found`)
            throw new createError.NotFound(`Product ${id} not found`);
        }
    }

    async deleteProductById(id: any, userRole: string): Promise<void> {
        const product = await this.getProductById(id)
        this.validateUserRole(userRole, product)
        const deleted = await this.productManager.deleteProductById(id)
        
        if (deleted == 1) {
            sendSocketMessage("productDeleted", id)
            logger.debug(`product with id: ${id} deleted`)
        } else {
            throw new createError.NotFound(`Product ${id} not found`)
        }
    }

    async deleteAll(userRole: string): Promise<void> {
        if (userRole === UserRoles.PREMIUM) {
            throw new createError
                .NotFound(`User not authorized to perform this action`)
        }
        await this.productManager.deleteAll()
    }

    async updateProductById(prodId: string, updatedFields: Partial<Product>,
        userRole: string): Promise<Product | void> {
        try {
            const product = await this.getProductById(prodId)
            this.validateUserRole(userRole, product)

            let udpatedProduct = await this.productManager
                .updateProductById(prodId, updatedFields)
            sendSocketMessage("productSaved", udpatedProduct)

            return udpatedProduct
        } catch (error: any) {
            throw new createError.NotFound(error.message)
        }
    }

    private validateUserRole(userRole: string, product: Product): void {
        const isUserAuthorized = (userRole === UserRoles.ADMIN ||
            (userRole === UserRoles.PREMIUM && product.owner === UserRoles.PREMIUM))
        if (!isUserAuthorized) {
            throw new createError
                .NotFound(`User not authorized to perform this action`)
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
        logger.debug(`pipeline: ${JSON.stringify(pipeline)}`)
        return pipeline
    }
}
