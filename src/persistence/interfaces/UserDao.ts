import type { User } from '../../entities/IUser'

export interface UserDao {
  createUser: (user: User) => Promise<User>
  findUser: (field: any) => Promise<User | null>
  updateUserRole: (userId: string, userRole: string) => Promise<void>
  updateUserPassword: (userEmail: string, userPassword: string) => Promise<void>
}
