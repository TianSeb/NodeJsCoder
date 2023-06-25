import { Router } from "express"
import CartController from "../controllers/CartController"
import asyncHandler from 'express-async-handler'

const cartController = new CartController()
const cartsRoute = Router()

cartsRoute.get('/carts',asyncHandler(cartController.getCarts))
cartsRoute.get('/carts/:cid',asyncHandler(cartController.getCart))
cartsRoute.put('/carts/:cid',asyncHandler(cartController.updateCart))
cartsRoute.put('/carts/:cid/product/:pid',asyncHandler(cartController.updateProductInCart))
cartsRoute.post('/carts',asyncHandler(cartController.createCart))
cartsRoute.post('/carts/:cid/product/:pid',asyncHandler(cartController.saveProductToCart))
cartsRoute.delete('/carts/:cid',asyncHandler(cartController.deleteCartById))
cartsRoute.delete('/carts',asyncHandler(cartController.deleteAll))
cartsRoute.delete('/carts/:cid/product/:pid',asyncHandler(cartController.deleteProductInCart))

export default cartsRoute
