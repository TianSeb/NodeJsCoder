import { User } from "../../entities/IUser"

export interface UserDao {
    createUser(user: User): Promise<User>
    loginUser(user:User): Promise<User>
}