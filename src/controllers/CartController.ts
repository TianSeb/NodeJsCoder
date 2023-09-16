import type { Request, Response, NextFunction } from 'express'
import CartService from '../services/CartService'
import { getUserRoleAndMail, createResponse } from '../utils/Utils'
import UserResponseDTO from '../persistence/mongo/dtos/user/User.Response'

const cartService = CartService.getInstance()

export default class CartController {
  async getCarts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    createResponse(res, 200, await cartService.getCarts())
  }

  async getCart(req: Request, res: Response, next: NextFunction): Promise<any> {
    createResponse(res, 200, await cartService.getCart(req.params.cid))
  }

  async updateCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    createResponse(
      res,
      200,
      await cartService.updateCart(req.params.cid, req.body)
    )
  }

  async updateProductInCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const productOwnerInfo = getUserRoleAndMail(req)
    const ownerRole = productOwnerInfo?.ownerRole ?? 'null'
    createResponse(
      res,
      200,
      await cartService.updateProductInCart(
        req.params.cid,
        req.params.pid,
        req.body,
        ownerRole
      )
    )
  }

  async createCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    createResponse(res, 201, await cartService.createCart())
  }

  async saveProductToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const productOwnerInfo = getUserRoleAndMail(req)
    const ownerRole = productOwnerInfo?.ownerRole ?? 'null'
    await cartService.saveProductToCart(
      req.params.cid,
      req.params.pid,
      ownerRole
    )
    createResponse(res, 201, 'Product saved successfully')
  }

  async purchaseTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    let user: UserResponseDTO
    let purchaseOrder: any = null
    if (req.user !== null && req.user !== undefined) {
      user = new UserResponseDTO(req.user)
      purchaseOrder = await cartService.purchaseTicket(
        req.params.cid,
        user.getEmail()
      )
    }
    createResponse(res, 201, purchaseOrder)
  }

  async deleteCartById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await cartService.deleteCartById(req.params.cid)
    createResponse(res, 200, 'Cart deleted successfully')
  }

  async deleteAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await cartService.deleteAll()
    createResponse(res, 200, 'All Carts have been deleted')
  }

  async deleteProductInCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await cartService.deleteProductInCart(req.params.cid, req.params.pid)
    createResponse(res, 200, `Product ${req.params.pid} deleted`)
  }
}
