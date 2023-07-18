import { ProductDao } from "./interfaces/ProductDao"
import ProductFsDao from "./fs/ProductFsDao"
import ProductManagerMongo from "./mongo/manager/ProductManagerMongo"
import { CartDao } from "./interfaces/CartDao"
import CartFsDao from "./fs/CartFsDao"
import CartMongoDao from "./mongo/manager/CartManagerMongo"
import { ChatDao } from "./interfaces/ChatDao"
import ChatManagerMongo from "./mongo/manager/ChatManagerMongo"
import { UserDao } from "./interfaces/UserDao"
import UserManagerMongo from "./mongo/manager/UserManagerMongo"
import config from "../config/Config"

export default class DaoFactory {
    private static productInstance: ProductDao
    private static cartInstance: CartDao
    private static chatInstance: ChatDao
    private static userInstance: UserDao

    private constructor() {
    }

    static getProductDaoInstance(): ProductDao {
        if (!DaoFactory.productInstance) {
            if (config.environment === 'test') {
                DaoFactory.productInstance = new ProductFsDao()
            } else {
                DaoFactory.productInstance = new ProductManagerMongo()
            }
        }
        return DaoFactory.productInstance
    }

    static getCartDaoInstance(): CartDao {
        if (!DaoFactory.cartInstance) {
            if (config.environment === 'test') {
                DaoFactory.cartInstance = new CartFsDao()
            } else {
                DaoFactory.cartInstance = new CartMongoDao()
            }
        }
        return DaoFactory.cartInstance
    }

    static getChatDaoInstance(): ChatDao {
        if (!DaoFactory.chatInstance) {
            DaoFactory.chatInstance = new ChatManagerMongo()
        }
        return DaoFactory.chatInstance
    }

    static getUserDaoInstance(): UserDao {
        if (!DaoFactory.userInstance) {
            DaoFactory.userInstance = new UserManagerMongo()
        }
        return DaoFactory.userInstance
    }
}
