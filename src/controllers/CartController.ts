import { Request, Response, NextFunction } from "express"
import CartService from "../services/CartService"
import { createResponse } from "../utils/Utils"

const cartService = CartService.getInstance()

export default class CartController {

    async getCarts(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await cartService.getCarts())
    }

    async getCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await cartService.getCart(req.params.cid))
    }

    async updateCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await cartService.updateCart(req.params.cid, req.body))
    }

    async updateProductInCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await cartService.updateProductInCart(req.params.cid, req.params.pid, req.body))
    }

    async createCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 201, await cartService.createCart())
    }

    async saveProductToCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 201, await cartService.saveProductToCart(req.params.cid, req.params.pid))
    }

    async purchaseTicket(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 201, await cartService.purchaseTicket(req.params.cid))
    }

    async deleteCartById(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await cartService.deleteCartById(req.params.cid))
    }

    async deleteAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await cartService.deleteAll())
    }

    async deleteProductInCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 200, await cartService.deleteProductInCart(req.params.cid, req.params.pid))
    }
}
