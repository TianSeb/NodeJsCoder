import config from '../../config/Config'
import mongoose from 'mongoose'
import createError from 'http-errors'

export const initMongoDb = async () => {
  mongoose.connect(config.mongoDatabaseUrl || "")
    .then(() => {
      console.log('Mongo Db connection successful')
    }).catch(err => {
      throw new createError.ServiceUnavailable(err)
    })
}
