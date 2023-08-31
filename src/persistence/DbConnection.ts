import { initMongoDb } from "./mongo/MongoConnection"
import config from "../config/Config"

export const initDbConnection = async () => {
  await initMongoDb()
}
