import { Router, Request, Response, NextFunction } from "express"
import CartManager from "../services/CartManager"
import asyncHandler from 'express-async-handler'

const cartManager = CartManager.getInstance()
const cartsRoute = Router()

cartsRoute.get('/carts',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.getCarts()
    })
}))

cartsRoute.get('/carts/:cid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.getCart(req.params.cid)
    })
}))

cartsRoute.put('/carts/:cid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.updateCart(req.params.cid, req.body) 
    })
}))

cartsRoute.put('/carts/:cid/product/:pid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.updateProductInCart(req.params.cid, req.params.pid, req.body) 
    })
}))

cartsRoute.post('/carts',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.createCart()
    })
}))

cartsRoute.post('/carts/:cid/product/:pid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.saveProductToCart(req.params.cid, req.params.pid)
    })
}))

cartsRoute.delete('/carts/:cid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.deleteCartById(req.params.cid)
    })
}))

cartsRoute.delete('/carts',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.deleteAll()
    })
}))

cartsRoute.delete('/carts/:cid/product/:pid',asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    return res.status(200).json({
        data: await cartManager.deleteProductInCart(req.params.cid, req.params.pid)
    })
}))

export default cartsRoute