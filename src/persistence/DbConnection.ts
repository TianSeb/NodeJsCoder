import { initMongoDb } from './mongo/MongoConnection'

export const initDbConnection = async (): Promise<void> => {
  await initMongoDb()
}
