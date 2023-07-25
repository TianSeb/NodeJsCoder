import { Schema, model } from 'mongoose'
import { Ticket } from '../../../entities/ITicket'

const TicketSchema: Schema = new Schema<Ticket>({
  code: { type: String, required: false, unique: true, index: true },
  purchase_datetime: { type: String, required: false },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true, unique: true, index: true },
}, {
  versionKey: false
})

export const TicketModel = model<Ticket>('Ticket', TicketSchema)
