import { Router } from "express"
import CartController from "../controllers/CartController"
import asyncHandler from 'express-async-handler'

const cartController = new CartController()
const cartsRoute = Router()

cartsRoute.get('/carts',asyncHandler(cartController.getCarts))
          .get('/carts/:cid',asyncHandler(cartController.getCart))
          .put('/carts/:cid',asyncHandler(cartController.updateCart))
          .put('/carts/:cid/product/:pid',asyncHandler(cartController.updateProductInCart))
          .post('/carts',asyncHandler(cartController.createCart))
          .post('/carts/:cid/product/:pid',asyncHandler(cartController.saveProductToCart))
          .post('/carts/:cid/purchase',asyncHandler(cartController.purchaseTicket))
          .delete('/carts/:cid',asyncHandler(cartController.deleteCartById))
          .delete('/carts',asyncHandler(cartController.deleteAll))
          .delete('/carts/:cid/product/:pid',asyncHandler(cartController.deleteProductInCart))

export default cartsRoute
