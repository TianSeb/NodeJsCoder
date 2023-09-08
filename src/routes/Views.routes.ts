import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import { isAuthenticated } from '../middlewares/AuthMw'
import ProductService from '../services/ProductService'
import asyncHandler from 'express-async-handler'

const viewsRoutes = Router()
const productService = ProductService.getInstance()

viewsRoutes.get(
  '/',
  isAuthenticated,
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const options = { page: 1, limit: 10 }
      const pipeline: any = []
      const response = await productService.getProducts(pipeline, options)
      const products = response.docs
      res.render('pages/products', { products })
    }
  )
)

viewsRoutes.get(
  '/realtimeproducts',
  isAuthenticated,
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      res.render('pages/index')
    }
  )
)

export default viewsRoutes
