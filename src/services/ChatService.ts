import DaoFactory from '../persistence/DaoFactory'
import type { ChatMessage } from '../entities/IChatMessage'

export default class ChatService {
  private static instance: ChatService | null = null
  private readonly chatDao

  private constructor() {
    this.chatDao = DaoFactory.getChatDaoInstance()
  }

  static getInstance(): ChatService {
    if (this.instance === null && this.instance !== undefined) {
      this.instance = new ChatService()
    }
    return this.instance
  }

  async saveMsg(data: any): Promise<ChatMessage | Error> {
    const chatMsg = await this.chatDao.saveMsg(data)
    return chatMsg
  }

  async getAllMsgs(): Promise<ChatMessage[] | Error> {
    return await this.chatDao.getAllMsgs()
  }

  async deleteAllMsgs(): Promise<void> {
    await this.chatDao.deleteAllMsgs()
  }
}
