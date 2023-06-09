import { Document } from "mongoose"

export interface ChatMessage extends Document {
    userEmail: string,
    msg: string
}