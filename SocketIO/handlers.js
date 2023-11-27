import UserService from '../serveces/UserService'
import logger from '../shared/logger'

export const pingHandler = (socket, callback) => {
  if (typeof callback === 'function') {
    // eslint-disable-next-line n/no-callback-literal
    callback({
      status: 'pong'
    })
  }
}

export const onlineHandler = async (socket, callback, namespace) => {
  try {
    const user = await UserService.makeOnline(socket.userId)
    socket.join('onlinesRoom')
    socket.broadcast
      .to('onlinesRoom')
      .emit('new-online-user', user.email)
    if (typeof callback === 'function') {
      // eslint-disable-next-line n/no-callback-literal
      callback({
        status: 'onlinesRoom'
      })
    }
  } catch (e) {
    logger.error(e)
  }
}

export const offlineHandler = async (socket, namespace) => {
  try {
    const user = await UserService.makeOffline(socket.userId)
    namespace.to('onlinesRoom').emit('user-leave', user.email)
  } catch (e) {
    logger.error(e)
  }
}
