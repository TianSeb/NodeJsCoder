import express, { Express } from 'express'
import http, { createServer } from 'http'
import routes from './routes/Routes'
import cookieParser from 'cookie-parser'
import { sessionStore } from './config/Session'
import config from './config/Config'
import errorHandler from './config/ErrorConfig'
import session from 'express-session'
import passport from 'passport'
import { initializeJwtPassport } from './config/passport/Jwt'

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
        this.app.use(cookieParser(config.cookieSecret))
        this.app.use(session(sessionStore))
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        initializeJwtPassport()
        this.app.use(routes)
        this.app.use(errorHandler)
        this.httpServer = createServer(this.app)
        this.port = process.env.PORT || "8001"
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
