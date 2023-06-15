import bcrypt from 'bcrypt'

export const createHash = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user: any, password: string) => {
    return bcrypt.compareSync(password, user.password)
}

