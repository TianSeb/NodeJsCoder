import express, { Express } from 'express'
import http, { createServer } from 'http'
import routes from '../routes/Routes'
import cookieParser from 'cookie-parser'
import errorHandler from '../config/ErrorConfig'
class Server {

    private app: Express
    private httpServer: http.Server
    private port: string

    constructor() {
        this.app = express()
        this.app.set('view engine', 'ejs')
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static('public'))
        this.app.use(cookieParser())
        this.app.use(routes)
        this.app.use(errorHandler)
        this.httpServer = createServer(this.app)
        this.port = process.env.PORT || "8080"
    }

    start() {
        this.httpServer.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }

    getHttpServer() {
        return this.httpServer
    }
}

export default Server