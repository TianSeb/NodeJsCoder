import { Product } from "../../../../entities/IProduct"

export default class ProductResponseDTO {

  private title:string | undefined
  private description: string | undefined
  private price: number | undefined
  private id: string | undefined
  
  constructor(product: Partial<Product>) {
    this.title = product.title
    this.description = product.description
    this.price = product.price
    this.id = product._id
  }
}