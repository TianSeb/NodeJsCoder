import { Schema, model } from 'mongoose'
import { Ticket } from '../../../entities/ITicket'

const TicketSchema: Schema = new Schema<Ticket>({
  code: { type: String, required: false, unique: true, index: true },
  purchase_datetime: { type: Date, required: false, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true, index: true },
}, { versionKey: false })

TicketSchema.methods.toJSON = function () {
  const ticketObject = this.toObject()
  delete ticketObject._id
  return ticketObject
}
export const TicketModel = model<Ticket>('Ticket', TicketSchema)