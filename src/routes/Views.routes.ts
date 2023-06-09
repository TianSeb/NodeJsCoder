import { Router, Request, Response, NextFunction } from "express"
import config from "../config/Config"
import ProductManager from "../services/ProductManager"
import asyncHandler from 'express-async-handler'

const viewsRoutes = Router()
const productManager = ProductManager.getInstance()

viewsRoutes.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { page, limit } = req.query
    const response = await productManager.getProducts(page, limit)
    const nextPage = response.hasNextPage ? `http://localhost:${config.port}/products?page=${response.nextPage}` : null
    const prevPage = response.hasPrevPage ? `http://localhost:${config.port}/products?page=${response.prevPage}` : null
    const products = response.docs
    res.render('pages/products', { products })
}))

viewsRoutes.get('/realtimeproducts', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    res.render('pages/index')
}))

export default viewsRoutes