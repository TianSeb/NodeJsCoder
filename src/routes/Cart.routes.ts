import { Router, Request, Response, NextFunction } from "express"
import CartService from "../services/CartService"
import asyncHandler from 'express-async-handler'

const cartService = CartService.getInstance()
const cartsRoute = Router()

cartsRoute.get('/carts',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.getCarts()
    })
}))

cartsRoute.get('/carts/:cid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.getCart(req.params.cid)
    })
}))

cartsRoute.put('/carts/:cid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.updateCart(req.params.cid, req.body) 
    })
}))

cartsRoute.put('/carts/:cid/product/:pid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.updateProductInCart(req.params.cid, req.params.pid, req.body) 
    })
}))

cartsRoute.post('/carts',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.createCart()
    })
}))

cartsRoute.post('/carts/:cid/product/:pid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.saveProductToCart(req.params.cid, req.params.pid)
    })
}))

cartsRoute.delete('/carts/:cid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.deleteCartById(req.params.cid)
    })
}))

cartsRoute.delete('/carts',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.deleteAll()
    })
}))

cartsRoute.delete('/carts/:cid/product/:pid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartService.deleteProductInCart(req.params.cid, req.params.pid)
    })
}))

export default cartsRoute