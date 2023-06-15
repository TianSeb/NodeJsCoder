import bcrypt from 'bcrypt'

export const createHash = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (password: string, user: any) => {
    return bcrypt.compareSync(password, user.password)
}

