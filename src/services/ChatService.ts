import DaoFactory from '../dao/DaoFactory'
import { ChatMessage } from '../entities/IChatMessage'

const chatDao = DaoFactory.getChatDaoInstance()

export default class ChatService {
    private static instance: ChatService | null = null

    constructor() {}

    static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService()
        }
        return ChatService.instance
    }

    async saveMsg(data:any) : Promise<ChatMessage | Error> {
        let chatMsg = await chatDao.saveMsg(data)
        return chatMsg
    }

    async getAllMsgs() : Promise<ChatMessage[] | Error> {
        return await chatDao.getAllMsgs()
    }

    async deleteAllMsgs() : Promise<void> {
        await chatDao.deleteAllMsgs()
    }
}
