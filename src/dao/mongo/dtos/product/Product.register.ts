import { Product } from "../../../../entities/IProduct"

export default class ProductRegisterDTO {

  private title:string | undefined
  private description: string | undefined
  private price: number | undefined
  private stock: number | undefined
  
  constructor(product: Partial<Product>) {
    this.title = product.title
    this.description = product.description
    this.price = product.price
    this.stock = product.stock
  }
}