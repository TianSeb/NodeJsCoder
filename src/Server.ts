import express from 'express'
import type { Express } from 'express'
import type http from 'http'
import { createServer } from 'http'
import cluster from 'cluster'
import { cpus } from 'os'
import routes from './routes/Routes'
import cookieParser from 'cookie-parser'
import sessionStore from './config/Session'
import config from './config/Config'
import errorHandler from './config/ErrorConfig'
import session from 'express-session'
import passport from 'passport'
import { initializeJwtPassport } from './config/passport/Jwt'
import helmet from 'helmet'
import { logger } from './utils/Logger'

class Server {
  private readonly app: Express
  private readonly httpServer: http.Server
  private readonly port: string
  private readonly numCPUs: number = cpus().length

  constructor() {
    this.app = express()
    this.app.use(helmet())
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
    this.configureClusterEvents()
    this.httpServer = createServer(this.app)
    this.port = config.port ?? '8001'
  }

  start(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`)
    })
  }

  startWithClusters(): void {
    if (cluster.isPrimary) {
      logger.info(`number of CPUs: ${this.numCPUs}`)
      for (let i = 0; i < this.numCPUs; i++) {
        cluster.fork()
      }
    } else {
      this.httpServer.listen(this.port, () => {
        console.log(
          `Server running on port ${this.port}, process: ${process.pid}`
        )
      })
    }
  }

  getHttpServer(): http.Server {
    return this.httpServer
  }

  private configureClusterEvents(): void {
    cluster.on('online', (worker) => {
      logger.info(`Worker ${worker.id} is online`)
    })

    cluster.on('exit', (worker, code) => {
      logger.info(
        `Child Process: ${
          worker.process.pid
        } exited with code ${code} - ${Date()}`
      )
      cluster.fork()
    })
  }
}

export default Server
