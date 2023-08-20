import { User } from "../../../../entities/IUser"

export default class UserResponseDTO {

  private firstName:string
  private lastName: string
  private email: string
  
  constructor(user: Partial<User>) {
    this.firstName = user.firstName || ""
    this.lastName = user.lastName || ""
    this.email = user.email || ""
  }

  getEmail() {
    return this.email
  }
}
