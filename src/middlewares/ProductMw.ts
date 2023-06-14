import { Request as ExpressRequest, Response, NextFunction } from "express"
import { buildProductQueryPipeline } from "../dao/mongo/models/Product"
import createError from 'http-errors'

export interface CustomProductRequest extends ExpressRequest {
  pipeline?: any[],
  options?: any
}

export const pipelineParams = async (req: CustomProductRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, category, status, sort } = req.query
    const parsedPage = parseInt(page as string) || 1
    const parsedLimit = parseInt(limit as string) || 10
    const options = { parsedPage, parsedLimit }

    const pipeline = await buildProductQueryPipeline(category, status, sort)
    req.pipeline = pipeline
    req.options = options

    next()
  } catch (error) {
    return next(createError(501, `error en los componentes para generar el pipeline: ${error}`))
  }
}
