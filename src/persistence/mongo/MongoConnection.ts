import config from '../../config/Config'
import mongoose from 'mongoose'
import createError from 'http-errors'
import { logger } from '../../utils/Logger'

export const initMongoDb = async () => {
  console.log(`chequeando secret ${process.env.NODE_ENV}`)
  console.log(`URL IS HERE? ${config.mongoDatabaseUrl}`)
  mongoose.connect(config.mongoDatabaseUrl)
    .then(() => {
      logger.debug('Mongo Db connection successful')
    }).catch(err => {
      throw new createError.ServiceUnavailable(err)
    })
}
