export interface User {
    _id?: string
    firstName: string
    lastName: string
    email: string
    password: string
    age: Number
    role?: string
    cart?: Types.ObjectId | string
}
