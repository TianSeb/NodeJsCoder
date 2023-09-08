import io from 'socket.io-client'
import config from '../config/Config'

const ip = config.socketUrl ?? `http://localhost:${config.port}`

export const sendSocketMessage = (message: any, data: any): any => {
  io(ip).connect()
  io(ip).emit(message, data)
  io(ip).disconnect()
}
