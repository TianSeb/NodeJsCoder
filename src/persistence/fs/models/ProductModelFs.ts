import type { Product } from '../../../entities/IProduct'

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

  constructor(data: Product) {
    this.title = data.title
    this.description = data.description
    this.code = data.code
    this.price = data.price
    this.status = data.status
    this.stock = data.stock
    this.category = data.category
    this.thumbnails = data.thumbnails
  }
}
