import express from 'express'
import { createServer } from 'http'
import Config from '../config'
import apiRoutes from '../routes/apiRoutes'
import SetupPassport from '../lib/passport'
import cors from 'cors'
import requestLogger from '../shared/requestLogger'
import logger from '../shared/logger'

class API {
  static async init () {
    const app = express()
    const passport = SetupPassport()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use(requestLogger)
    app.use(passport.initialize())
    app.use('/api', apiRoutes)
    app.set('env', Config.nodeEnv)
    app.use((req, res) => {
      logger.info(`Request url ${req.url}`)
      res.json({ message: 'API not found' })
    })

    const server = createServer(app)

    const port = Config.port

    server.listen(port, () => {
      logger.info(`Rest server started on port: ${port}`)
    })
    return server
  }
}

export default API
