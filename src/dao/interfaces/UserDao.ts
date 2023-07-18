import { User } from "../../entities/IUser"

export interface UserDao {
    createUser(user: User): Promise<User>
    findUser(field:any): Promise<User | null>
}