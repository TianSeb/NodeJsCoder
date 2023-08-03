import { Router } from "express"
import { Request, Response, NextFunction } from "express"
import asyncHandler from 'express-async-handler'
import { generateRandomProducts } from "../utils/Faker"
import { createResponse } from "../utils/Utils"

const mockRoute = Router()

mockRoute.get('/mockingproducts',asyncHandler((req: Request, res: Response, next: NextFunction) => {
  const { category, count } = req.body
  createResponse(res, 201, generateRandomProducts(category, count))
}))

export default mockRoute
