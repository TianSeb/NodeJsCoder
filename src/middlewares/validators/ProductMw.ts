import { Request as ExpressRequest, Response, NextFunction } from "express"
import ProductService from "../../services/ProductService"
import createError from 'http-errors'
import { logger } from "../../utils/Logger"

const productService = ProductService.getInstance()
export interface CustomProductRequest extends ExpressRequest {
  pipeline?: any[],
  options?: any
}

export const pipelineParams = async (req: CustomProductRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug("pipelineParams")
    const { page, limit, category, status, sort } = req.query
    const parsedPage = parseInt(page as string) || 1
    const parsedLimit = parseInt(limit as string) || 10
    const options = { page: parsedPage, limit: parsedLimit }
    const pipeline = productService.buildProductQueryPipeline(category, status, sort)
    req.pipeline = pipeline
    req.options = options
    
    next()
  } catch (error:any) {
    logger.error(error.message)
    return next(createError(501, `Something went wrong when building the pipeline params: ${error}`))
  }
}

export const validateSchema = (schema: any) => (req: any, res: Response, next: NextFunction): void => {
  try {
    logger.debug("validateSchema")
    schema.parse({
      body: req.body
    })
    next()
  } catch (err: any) {
    const missingFields = err.issues.map((issue: any) => issue.path.join('.'))
    const errorMessage = `Missing required fields: ${missingFields.join(', ')}`
    logger.error(errorMessage)
    return next(createError(400, errorMessage))
  }
}

