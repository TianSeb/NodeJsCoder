import type { Product } from '../../../../entities/IProduct'

export default class ProductRegisterDTO {
  private readonly title: string | undefined
  private readonly description: string | undefined
  private readonly price: number | undefined
  private readonly stock: number | undefined

  constructor(product: Partial<Product>) {
    this.title = product.title
    this.description = product.description
    this.price = product.price
    this.stock = product.stock
  }
}
