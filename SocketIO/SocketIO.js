import { Server } from 'socket.io'
import AuthService from '../serveces/authService'
import Config from '../config'
import userNamespaceHandler from './userNamespaceHandler'
import { pingHandler } from './handlers'
import logger from '../shared/logger'

class SocketIO {
  static async init (httpServer) {
    const io = new Server(httpServer)
    const userNamespace = io.of('/users')
    userNamespace.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        if (token) {
          const { userId } = await AuthService.checkToken(token, Config.userRoles)
          socket.userId = userId
          return next()
        }
        throw new Error('Auth token required')
      } catch (e) {
        next(e)
      }
    })
    io.on('connection', (socket) => {
      socket.on('ping', (callback) => pingHandler(socket, callback))
    })
    userNamespace.on('connection', (socket) => {
      logger.info(`new socket: ${socket.id}`)
      userNamespaceHandler(io, socket, userNamespace)
    })
  }
}
export default SocketIO
