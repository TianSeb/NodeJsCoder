import Server from './Server'
import { initDbConnection } from './persistence/DbConnection'

const server: Server = new Server()

const init = async (): Promise<void> => {
  await initDbConnection()
  server.start()
}

void init()
