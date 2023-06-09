import DaoFactory from '../dao/DaoFactory'
import { ChatMessage } from '../entities/IChatMessage'

const chatDao = DaoFactory.getChatDaoInstance()

export default class ChatManager {
    private static instance: ChatManager | null = null

    constructor() {}

    static getInstance(): ChatManager {
        if (!ChatManager.instance) {
            ChatManager.instance = new ChatManager()
        }
        return ChatManager.instance
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
