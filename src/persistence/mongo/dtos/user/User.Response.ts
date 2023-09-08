import type { User } from '../../../../entities/IUser'

export default class UserResponseDTO {
  private readonly firstName: string
  private readonly lastName: string
  private readonly email: string

  constructor(user: Partial<User>) {
    this.firstName = user.firstName ?? ''
    this.lastName = user.lastName ?? ''
    this.email = user.email ?? ''
  }

  getEmail(): string {
    return this.email
  }
}
