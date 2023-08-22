import { Router } from "express"
import { Request, Response, NextFunction } from "express"
import asyncHandler from 'express-async-handler'
import { generateRandomProducts } from "../utils/Faker"
import { createResponse } from "../utils/Utils"

const mockRoute = Router()

mockRoute.get('/mockingproducts',asyncHandler((req: Request, res: Response, next: NextFunction) => {
  const queryParams: [string, string] = [req.query.category as string, req.query.count as string];
  const [category, count] = queryParams
  createResponse(res, 201, generateRandomProducts(category, Number(count)))
}))

export default mockRoute
