import type { Product } from '../../../entities/IProduct'
import { UserRoles } from '../../../entities/IUser'

export default class ProductModelFs implements Product {
  id?: string
  title: string
  description: string
  code: string
  price: number
  status?: boolean
  stock: number
  category: string
  thumbnails: string[]
  ownerRole: string
  userEmail: string

  constructor(data: Product) {
    this.title = data.title
    this.description = data.description
    this.code = data.code
    this.price = data.price
    this.status = data.status
    this.stock = data.stock
    this.category = data.category
    this.thumbnails = data.thumbnails
    this.ownerRole = data.ownerRole ?? UserRoles.USER
    this.userEmail = data.userEmail ?? 'user@example.com'
  }
}
