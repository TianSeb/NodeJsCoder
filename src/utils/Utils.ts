import bcrypt from 'bcrypt'
import log4js from 'log4js'

export const createHash = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (password: string, user: any) => {
    return bcrypt.compareSync(password, user.password)
}

export const createResponse = (res:any, statusCode:any, data:any) => {
    return res.status(statusCode).json({data})
}

export const logger = log4js.getLogger()
