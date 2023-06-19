import { Schema, model } from 'mongoose'
import { User } from '../../../entities/IUser'

const UserSchema: Schema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  age: { type: Number },
  role: { type: String, default: 'user' },
  isGithub: {type: Boolean, default: false },
  isGoogle: {type: Boolean, default: false },
}, {
  versionKey: false
})

export const UserModel = model<User>('User', UserSchema)
