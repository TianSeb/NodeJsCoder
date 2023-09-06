import sessionFileStore from 'session-file-store'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './Config'

let mongoStoreOptions
const isTestEnvironment = process.env.NODE_ENV === 'testing'
const FileStore = sessionFileStore(session)

const cookiesConfig: any = {
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: false,
}

const fileStoreOptions = {
  store: new FileStore({
    path: './sessions',
    ttl: 380,
    reapInterval: 120
  }),
  ...cookiesConfig
}

if (!isTestEnvironment) {
  mongoStoreOptions = {
    store: new MongoStore({
      mongoUrl: config.mongoDatabaseUrl,
      ttl: 380
    }),
    ...cookiesConfig
  }
}

export const sessionStore: any = isTestEnvironment ? fileStoreOptions : mongoStoreOptions