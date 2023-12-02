import express from 'express'
import { createServer } from 'http'
import Config from '../config'
import apiRoutes from '../routes'
import cors from 'cors'
import requestLogger from '../shared/requestLogger'
import logger from '../shared/logger'
import helmet from 'helmet'
import { responseSender } from '../utils/util'
import { CustomError } from '../shared/error'
import { promisifyAPI } from '../middlewares/promisify'

class API {
  static async init () {
    const app = express()
    app.use(promisifyAPI())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(helmet())
    app.use(cors())
    app.use(requestLogger)
    app.use('/register', apiRoutes)
    app.set('env', Config.nodeEnv)

    app.use((req, res) => {
      const message = {
        message: 'API not found',
        method: req.method,
        url: req.originalUrl,
        IP: req.headers['x-forwarded-for']
      }
      logger.warn(message)
      responseSender(
        new CustomError('API not found', 'API_NOT_FOUND', 400, message),
        res
      )
    })

    app.use(function (req, res, next) {
      const info = {
        url: req.originalUrl,
        IP: req.headers['x-forwarded-for']
      }
      res.promisify(
        Promise.reject(
          new CustomError('API not found', 'API_NOT_FOUND', 400, info)
        )
      )
    })
    app.use(function (err, req, res, next) {
      res.promisify(Promise.reject(err))
    })
    const server = createServer(app)

    server.listen(Config.port)
    server.on('listening', () => {
      const addr = server.address()
      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`

      const cleanup = async () => {}

      process.on('uncaughtException', async () => {
        await cleanup()
        process.exit(0)
      })

      process.on('SIGTERM', async () => {
        await cleanup()
        process.exit(0)
      })

      process.on('SIGINT', async () => {
        await cleanup()
        process.exit(0)
      })

      console.info(
        `${Config.serviceName}:${Config.serviceVersion} listening on ${bind}`
      )
    })
    return server
  }
}

export default API
