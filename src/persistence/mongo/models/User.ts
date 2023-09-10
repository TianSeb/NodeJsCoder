import { Schema, model } from 'mongoose'
import type { User } from '../../../entities/IUser'
import { UserRoles } from '../../../entities/IUser'

const userSchema: Schema = new Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: { unique: true }
    },
    password: { type: String, required: true },
    age: { type: Number },
    role: { type: String, default: UserRoles.USER },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart', required: false }
  },
  {
    versionKey: false
  }
)

export const UserModel = model<User>('User', userSchema)
