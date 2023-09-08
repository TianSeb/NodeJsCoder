export interface Ticket {
  code: string
  purchase_datetime: Date
  amount: number
  purchaser: string
  products: Array<{
    name: string
    qty: number
    price: number
    total: number
  }>
}
