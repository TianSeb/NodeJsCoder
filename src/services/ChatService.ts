import DaoFactory from '../dao/DaoFactory'
import { ChatMessage } from '../entities/IChatMessage'

export default class ChatService {

    private static instance: ChatService | null = null
    private chatDao

    constructor() {
        this.chatDao = DaoFactory.getChatDaoInstance()
    }

    static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService()
        }
        return ChatService.instance
    }

    async saveMsg(data:any) : Promise<ChatMessage | Error> {
        let chatMsg = await this.chatDao.saveMsg(data)
        return chatMsg
    }

    async getAllMsgs() : Promise<ChatMessage[] | Error> {
        return await this.chatDao.getAllMsgs()
    }

    async deleteAllMsgs() : Promise<void> {
        await this.chatDao.deleteAllMsgs()
    }
}
