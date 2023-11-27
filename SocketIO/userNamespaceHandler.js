import { onlineHandler, offlineHandler } from './handlers'
import logger from '../shared/logger'

const userNamespaseHandler = async (io, socket, userNamespace) => {
  try {
    socket.on('online', (callback) =>
      onlineHandler(socket, callback, userNamespace)
    )

    socket.on('disconnect', (reason) => {
      logger.warn(`disconnect ${socket.userId}`)
      logger.warn(`disconnect reason ${reason}`)
      offlineHandler(socket, userNamespace)
    })
    socket.join(socket, userNamespace)
  } catch (e) {
    console.error(e)
    socket.emit('error', 'Unexpected error')
  }
}

export default userNamespaseHandler
