import config from '../../config/Config'
import mongoose from 'mongoose'
import createError from 'http-errors'
import { logger } from '../../utils/Logger'

export const initMongoDb = async () => {
  mongoose.connect(config.mongoDatabaseUrl || "")
    .then(() => {
      logger.debug('Mongo Db connection successful')
    }).catch(err => {
      throw new createError.ServiceUnavailable(err)
    })
}
