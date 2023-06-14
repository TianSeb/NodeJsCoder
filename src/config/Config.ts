import dotenv from 'dotenv'
import path from 'path';
import sessionFileStore from 'session-file-store'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const rootPath = process.cwd()

dotenv.config({
  path: path.resolve(rootPath, `./.env.${process.env.NODE_ENV}`)
})

export const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoDatabaseUrl: process.env.DB_MONGO_URL,
  socketUrl: process.env.SOCKET_URL,
  cookieSecret: process.env.COOKIE_SECRET || "12345789",
}

// Cookie && Session Configs
let mongoStoreOptions
const isTestEnvironment = process.env.NODE_ENV === 'test'
const FileStore = sessionFileStore(session)

const cookiesConfig: any = {
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 18000 }
}

const fileStoreOptions = {
  store: new FileStore({
    path: './sessions',
    ttl: 180,
    reapInterval: 60
  }),
  ...cookiesConfig
}

if (!isTestEnvironment) {
  mongoStoreOptions = {
    store: new MongoStore({
      mongoUrl: config.mongoDatabaseUrl,
      autoRemove: 'interval',
      autoRemoveInterval: 1 //minute
    }),
    ...cookiesConfig
  }
}

export const sessionStore: any = isTestEnvironment ? fileStoreOptions : mongoStoreOptions
export default config