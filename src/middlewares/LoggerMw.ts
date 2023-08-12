import { Request, Response, NextFunction } from "express"
import cluster from "cluster"
import { logger } from "../utils/Logger"

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction ) => {
  logger.debug(`${req.method} for ${req.url} - ${new Date().toLocaleDateString()}`)
  logger.debug(`process id: ${process.pid} - isWorker: ${cluster.isWorker}`)
  next()
}