import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid'
import createError from 'http-errors'
import { Ticket } from "../../../entities/ITicket"
import MongoDao from "../MongoDao"
import { TicketModel } from "../models/Ticket"

export default class TicketManagerMongo extends MongoDao<Ticket> {

    constructor() {
        super(TicketModel)
    }

    async createTicket(amount: Number): Promise<Ticket> {
        try {
            const ticketData = {
                code: uuidv4(),
                amount: amount,
                purchaser: 'Prueba',
            }

            const ticketInstance = new TicketModel(ticketData)
            const savedTicket = await ticketInstance.save()
            console.log(`Ticket Saved`)
            return savedTicket
        } catch (error: any) {
            throw createError.RequestTimeout("There was a problem while creating purchase ticket")
        }
    }

    async getTicket(id: string): Promise<Ticket | null> {
        return await super.findById(id)
    }

    async getTickets(): Promise<Ticket[] | null> {
        return await super.findAll()
    }

}
