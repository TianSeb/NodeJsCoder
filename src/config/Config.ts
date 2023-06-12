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
  mongoSessionUrl: process.env.DB_MONGO_SESSION || "",
  socketUrl: process.env.SOCKET_URL,
  cookieSecret: process.env.COOKIE_SECRET || "12345789"
}

export default config
