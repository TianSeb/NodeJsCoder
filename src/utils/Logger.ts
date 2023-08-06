import { createLogger, format, transports } from 'winston'
import 'winston-mongodb'
import config from '../config/Config'

const { combine, printf, timestamp, colorize } = format

const logConfig = {
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf((info: any) => `${info.level} | ${[info.timestamp]} | ${info.message}`)
  ),
  transports: [
    new transports.Console({ 
      level: 'info'
    }),
    new transports.File({ 
      filename: './logs/app.log', 
      level: 'error' }),
    new transports.MongoDB({
      options: { useUnifiedTopology: true }, 
      db: config.mongoDatabaseUrl || "",
      collection: 'logs',
      tryReconnect: true,
      level: 'error'
  })
  ]
}

export const logger = createLogger(logConfig)
