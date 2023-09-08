import { Schema, model } from 'mongoose'
import type { ChatMessage } from '../../../entities/IChatMessage'

export const ChatMessageSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true },
    msg: { type: String, required: true, maxlength: 100 }
  },
  {
    versionKey: false
  }
)

export const ChatMessageModel = model<ChatMessage>(
  'ChatMessage',
  ChatMessageSchema
)
