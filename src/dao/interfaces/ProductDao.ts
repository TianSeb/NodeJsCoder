import { Product } from "../../entities/IProduct"
import { PaginateResult } from 'mongoose'

export interface ProductDao {
    addProduct(data: any): Promise<Product>
    getProducts(pipeline?:any, options?:any): Promise<PaginateResult<Product> | any>
    getProductById(id: any): Promise<Product | null>
    deleteProductById(id: any): Promise<number>
    deleteAll(): Promise<void>
    updateProductById(prodId: string, updatedFields: Partial<Product>): Promise<Product>
}