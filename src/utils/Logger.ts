import { createLogger, transports, format, addColors } from 'winston'
import type { config as wconfig, Logger, LeveledLogMethod } from 'winston'
import 'winston-mongodb'
import config from '../config/Config'

const { combine, printf, timestamp, colorize, errors, json } = format

const myCustomLevels: wconfig.AbstractConfigSetLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
}

const myCustomColors: wconfig.AbstractConfigSetColors = {
  fatal: 'red',
  error: 'cyan',
  warn: 'yellow',
  info: 'blue',
  debug: 'green'
}

interface CustomLevels extends Logger {
  fatal: LeveledLogMethod
  error: LeveledLogMethod
  warn: LeveledLogMethod
  info: LeveledLogMethod
  debug: LeveledLogMethod
}

let loggerConfig
if (config.environment === 'production') {
  loggerConfig = {
    levels: myCustomLevels,
    level: 'error',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [
      new transports.MongoDB({
        options: { useUnifiedTopology: true },
        db: config.mongoDatabaseUrl ?? '',
        collection: 'logs',
        tryReconnect: true,
        level: 'error'
      }),
      new transports.File({
        filename: './logs/app.log',
        level: 'error'
      })
    ]
  }
} else {
  loggerConfig = {
    levels: myCustomLevels,
    level: 'debug',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf(
        (info: any) => `${info.level} | ${info.timestamp} | ${info.message}`
      ),
      errors({ stack: true }),
      colorize({ all: true })
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: './logs/app.log',
        level: 'error'
      })
    ],
    silent: process.env.NODE_ENV === 'testing'
  }
}
addColors(myCustomColors)

export const logger = createLogger(loggerConfig) as CustomLevels
