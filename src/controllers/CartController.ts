import { Request, Response, NextFunction } from "express"
import CartService from "../services/CartService"
import { getUserRole } from "../utils/Utils"
import { createResponse } from "../utils/Utils"
import UserResponseDTO from "../persistence/mongo/dtos/user/User.Response"

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
        const userRole = getUserRole(req)
        createResponse(res, 200, await cartService
            .updateProductInCart(req.params.cid, req.params.pid, req.body, userRole))
    }

    async createCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        createResponse(res, 201, await cartService.createCart())
    }

    async saveProductToCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        const userRole = getUserRole(req)
        createResponse(res, 201, await cartService
            .saveProductToCart(req.params.cid, req.params.pid, userRole))
    }

    async purchaseTicket(req: Request, res: Response, next: NextFunction): Promise<any> {
        let user: UserResponseDTO
        let purchaseOrder: any = null
        if (req.user) {
            user = new UserResponseDTO(req.user)
            purchaseOrder = await cartService.purchaseTicket(req.params.cid, user.getEmail())
        }
        createResponse(res, 201, purchaseOrder)
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
