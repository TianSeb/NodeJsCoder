import type { Product } from '../../../../entities/IProduct'

export default class ProductResponseDTO {
  private readonly title: string | undefined
  private readonly description: string | undefined
  private readonly price: number | undefined
  private readonly id: string | undefined

  constructor(product: Partial<Product>) {
    this.title = product.title
    this.description = product.description
    this.price = product.price
    this.id = product._id
  }
}
