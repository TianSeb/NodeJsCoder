import sessionFileStore from 'session-file-store'
import session from 'express-session'
import type { SessionOptions } from 'express-session'
import MongoStore from 'connect-mongo'
import config from './Config'

let sessionStore: SessionOptions
const isTestEnvironment = process.env.NODE_ENV === 'testing'
const FileStore = sessionFileStore(session)

const fileStoreOptions = {
  store: new FileStore({
    path: './sessions',
    ttl: 380,
    reapInterval: 120
  }),
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: false
}

const mongoStoreOptions: SessionOptions = {
  store: new MongoStore({
    mongoUrl: config.mongoDatabaseUrl,
    ttl: 380
  }),
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: false
}

if (isTestEnvironment) {
  sessionStore = fileStoreOptions
} else {
  sessionStore = mongoStoreOptions
}

export default sessionStore
