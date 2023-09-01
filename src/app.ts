import Server from './Server'
import { initDbConnection } from './persistence/DbConnection'
import { SocketServer } from './socket/SocketServer'

const server: Server = new Server()
const socketService = new SocketServer(server.getHttpServer())

const init = async () => {
  console.log(`chequeando secret ${process.env.NODE_ENV}`)
  await initDbConnection()
  server.start()
}

init()