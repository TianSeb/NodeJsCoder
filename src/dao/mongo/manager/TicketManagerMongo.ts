import { Ticket } from "../../../entities/ITicket"
import MongoDao from "../MongoDao"
import { TicketModel } from "../models/Ticket"

export default class TicketManagerMongo extends MongoDao<Ticket> {

    constructor() {
        super(TicketModel)
    }

    async saveTicket(ticket: Ticket): Promise<Ticket> {
       return await super.create(ticket)
    }

    async getTicket(id: string): Promise<Ticket | null> {
        return await super.findById(id)
    }

    async getTickets(): Promise<Ticket[] | null> {
        return await super.findAll()
    }
}
