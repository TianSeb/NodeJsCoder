import MongoDao from '../MongoDao'
import { ChatMessageModel } from '../models/ChatMessage'
import type { ChatMessage } from '../../../entities/IChatMessage'
import type { ChatDao } from '../../interfaces/ChatDao'

export default class ChatManagerMongo
  extends MongoDao<ChatMessage>
  implements ChatDao
{
  constructor() {
    super(ChatMessageModel)
  }

  async saveMsg(data: any): Promise<ChatMessage | Error> {
    return await super.create(data)
  }

  async getAllMsgs(): Promise<ChatMessage[] | Error> {
    return await super.findAll()
  }

  async deleteAllMsgs(): Promise<void> {
    await super.deleteAll()
  }
}
