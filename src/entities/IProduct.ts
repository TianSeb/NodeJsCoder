export interface Product {
  _id?: string
  title: string
  description: string
  code: string
  price: number
  status?: boolean
  stock: number
  category: string
  ownerRole?: string
  userEmail?: string
  thumbnails: string[]
}

export type ProductOwnerInfo = Pick<Product, 'ownerRole' | 'userEmail'>
