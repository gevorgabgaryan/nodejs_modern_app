import { Server } from 'ws'
import http from 'http'
import Config from '../config'
import { UserManager } from './UserManager'
import { RequestsManager } from './RequestsManager'
import logger from '../shared/logger'

class WsHandler {
  async init () {
    const port = Config.wsPort
    this.server = http.createServer()

    this.server.on('error', (err) => {
      logger.warn('Websocket server error', err)
    })

    this.server.on('close', () => {
      logger.warn('Websocket closed')
    })

    this.server.listen(port, () => {
      logger.info(`WS server listening on port ${port}`)
    })

    this.wsServer = new Server({
      server: this.server
    })

    this.userManager = new UserManager()
    this.requestsManager = new RequestsManager()
    this.requestsManager.initCalls()

    this.wsServer.on('connection', (socket, request) =>
      this.onSocketConnection(socket, request)
    )
  }

  onSocketConnection (socket, request) {
    logger.warn('New websocket connection')
    this.userManager.add(socket)
    socket.on(
      'message',
      async (data) => await this.onSocketMessage(socket, data)
    )
    socket.on('close', (code, reason) => this.onSocketClose(socket, code, reason))
  }

  async onSocketMessage (socket, data) {
    const payload = JSON.parse(data)

    logger.warn('Received: ', payload)

    await this.requestsManager.handleRequests(socket, data)
  }

  onSocketClose (socket, code, reason) {
    logger.warn(`Client has disconnected; code ${code}, reason: ${reason}`)
    this.userManager.remove(socket)
  }
}

export default WsHandler
