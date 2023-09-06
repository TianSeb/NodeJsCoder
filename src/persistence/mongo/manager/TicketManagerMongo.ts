import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid'
import createError from 'http-errors'
import { Ticket } from "../../../entities/ITicket"
import MongoDao from "../MongoDao"
import { TicketModel } from "../models/Ticket"
import { logger } from "../../../utils/Logger"

export default class TicketManagerMongo extends MongoDao<Ticket> {

    constructor() {
        super(TicketModel)
    }

    async createTicket(amount: Number, userEmail: string, products: any): Promise<Ticket> {
        try {
            const ticketData = {
                code: uuidv4(),
                amount: amount,
                purchaser: userEmail,
                products: products
            }

            const ticketInstance = new TicketModel(ticketData)
            const savedTicket = await ticketInstance.save()

            logger.debug(`Ticket Saved ${JSON.stringify(savedTicket)}`)
            return savedTicket
        } catch (error: any) {
            logger.error(`error creating ticket ${error.msg}`)
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
