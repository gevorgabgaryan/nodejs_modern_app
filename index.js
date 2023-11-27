import MongooseService from './databases/MongooseService'
import API from './API/API'
import WsHandler from './websocket/WsHandler'
import SocketIO from './SocketIO/SocketIO'
import RedisService from './databases/RedisService'
import SequelizeService from './databases/SequelizeService';

(async () => {
  await MongooseService.init()
  await SequelizeService.init()
  RedisService.init()
  const server = await API.init()
  const wsHandler = new WsHandler()
  wsHandler.init()
  SocketIO.init(server)
})()
