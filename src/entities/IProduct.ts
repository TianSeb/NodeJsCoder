export interface Product {
  _id?: string
  title: string
  description: string
  code: string
  price: number
  status?: boolean
  stock: number
  category: string
  owner?: string
  thumbnails: string[]
}
