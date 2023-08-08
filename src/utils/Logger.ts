import { createLogger, transports, format, config as wconfig, Logger, LeveledLogMethod, addColors } from 'winston'
import 'winston-mongodb'
import config from '../config/Config'

const { combine, printf, timestamp, colorize } = format

const myCustomLevels: wconfig.AbstractConfigSetLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
}

const myCustomColors: wconfig.AbstractConfigSetColors = {
  fatal:'red',
  error:'cyan',
  warn: 'yellow',
  info: 'blue',
  debug: 'green',
}

interface CustomLevels extends Logger {
  fatal: LeveledLogMethod
  error: LeveledLogMethod
  warn: LeveledLogMethod
  info: LeveledLogMethod
  debug: LeveledLogMethod
}

const logConfig = {
  levels: myCustomLevels,
  level: config.environment === 'production' ? 'error' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf((info: any) => `${info.level} | ${[info.timestamp]} | ${info.message}`),
    colorize({ all: true})
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: './logs/app.log',
      level: 'error'
    })
  ],
  silent: process.env.NODE_ENV === 'test',
}

if (config.environment === 'production') {
  const mongoTransport: any = new transports.MongoDB({
    options: { useUnifiedTopology: true },
    db: config.mongoDatabaseUrl || '',
    collection: 'logs',
    tryReconnect: true,
    level: 'error'
  })
  logConfig.transports.push(mongoTransport)
}

addColors(myCustomColors)
export const logger: CustomLevels =  <CustomLevels> createLogger(logConfig)
