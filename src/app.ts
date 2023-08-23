import Server from './Server'
import { initDbConnection } from './persistence/DbConnection'
import { SocketServer } from './socket/SocketServer'

const server: Server = new Server()
const socketService = new SocketServer(server.getHttpServer())

const init = async () => {
  await initDbConnection()
  server.start()
}

init()