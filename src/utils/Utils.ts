import { Request as ExpressRequest, Response, NextFunction } from "express"
import createError from 'http-errors'

export interface CustomRequest extends ExpressRequest {
  pipeline?: any[],
  options?: any
}

export const validate = (schema:any) => (req:CustomRequest, res:Response, next:NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })

      next()
    } catch (err:any) {
        const missingFields = err.issues.map((issue:any) => issue.path.join('.'))
        const errorMessage = `Missing required fields: ${missingFields.join(', ')}`
        return next(createError(400, errorMessage))
    }
}

export const pipelineParams = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, category, status, sort } = req.query
    const parsedPage = parseInt(page as string) || 1
    const parsedLimit = parseInt(limit as string) || 10
    const options = { parsedPage, parsedLimit }

    const pipeline = await buildPipeline(category, status, sort)
    req.pipeline = pipeline
    req.options = options

    next()
  } catch (error) {
    return next(createError(501, `error en los componentes para generar el pipeline: ${error}`))
  }
}

const buildPipeline = async (category: any, status: any, sort: any): Promise<any[]> => {
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