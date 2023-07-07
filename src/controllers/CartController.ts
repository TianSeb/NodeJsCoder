import { Request, Response, NextFunction } from "express"
import CartService from "../services/CartService"

const cartService = CartService.getInstance()

export default class CartController {

    async getCarts(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.getCarts()
        })
    }

    async getCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.getCart(req.params.cid)
        })
    }

    async updateCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.updateCart(req.params.cid, req.body) 
        })
    }

    async updateProductInCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.updateProductInCart(req.params.cid, req.params.pid, req.body) 
        })
    }

    async createCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.createCart()
        })
    }

    async saveProductToCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.saveProductToCart(req.params.cid, req.params.pid)
        })
    }

    async deleteCartById(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.deleteCartById(req.params.cid)
        })
    }

    async deleteAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.deleteAll()
        })
    }

    async deleteProductInCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        return res.status(200).json({
            data: await cartService.deleteProductInCart(req.params.cid, req.params.pid)
        })
    }
}
