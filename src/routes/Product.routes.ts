import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductController from '../controllers/ProductController'
import { ProductSchemaValidator } from '../persistence/mongo/models/Product'
import {
  pipelineParams,
  validateSchema
} from '../middlewares/validators/ProductMw'
import { validateUserRole } from '../middlewares/AuthMw'
import { UserRoles } from '../entities/IUser'

const productController = new ProductController()
const productsRoute = Router()

productsRoute
  .get(
    '/products',
    asyncHandler(pipelineParams),
    asyncHandler(productController.getProducts)
  )
  .get('/products/:pid', asyncHandler(productController.getProductById))
  .post(
    '/products/',
    validateUserRole([UserRoles.ADMIN, UserRoles.PREMIUM]),
    validateSchema(ProductSchemaValidator),
    asyncHandler(productController.addProduct)
  )
  .put(
    '/products/:pid',
    validateUserRole([UserRoles.ADMIN, UserRoles.PREMIUM]),
    asyncHandler(productController.updateProductById)
  )
  .delete(
    '/products/:pid',
    validateUserRole([UserRoles.ADMIN, UserRoles.PREMIUM]),
    asyncHandler(productController.deleteProductById)
  )
  .delete(
    '/products/',
    validateUserRole([UserRoles.ADMIN]),
    asyncHandler(productController.deleteAll)
  )

export default productsRoute
