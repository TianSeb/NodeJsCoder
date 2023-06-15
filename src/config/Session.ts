import sessionFileStore from 'session-file-store'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './Config'

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