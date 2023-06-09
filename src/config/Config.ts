import dotenv from 'dotenv'
import path from 'path';

const rootPath = process.cwd()
dotenv.config({
  path: path.resolve(rootPath, `./.env.${process.env.NODE_ENV}`)
})

const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoDatabaseUrl: process.env.DB_MONGO_URL,
  socketUrl: process.env.SOCKET_URL
}

export default config
