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
  socketUrl: process.env.SOCKET_URL,
  cookieSecret: process.env.COOKIE_SECRET || "12345789",
  gitClientId: process.env.GIT_CLIENT_ID,
  gitClientSecret: process.env.GIT_SECRET,
  gitCallbackUrl: process.env.GIT_CALLBACK,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_SECRET
}

export default config