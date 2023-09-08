import type { ChatMessage } from '../../entities/IChatMessage'

export interface ChatDao {
  saveMsg: (data: any) => Promise<ChatMessage | Error>
  getAllMsgs: () => Promise<ChatMessage[] | Error>
  deleteAllMsgs: () => Promise<void>
}
