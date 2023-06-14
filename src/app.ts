import Server from './Server'
import { SocketServer } from './socket/SocketServer'
import mongoose from 'mongoose'
import config from './config/Config'
import createError from 'http-errors'

const server: Server = new Server()
const socketService = new SocketServer(server.getHttpServer())

if(config.environment !== 'test') {
    mongoose.connect(config.mongoDatabaseUrl || "")
    .then(() => {
        console.log('Mongo Db connection successful')
    }).catch(err => {
        throw new createError.ServiceUnavailable(err)
    })    
}
server.start()