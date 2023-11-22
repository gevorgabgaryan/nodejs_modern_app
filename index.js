import MongooseService from "./databases/MongooseService";
import API from "./API/API";
import WsHandler from "./websocket/WsHandler";
import SocketIO from "./SocketIO/SocketIO";
import RedisService from "./databases/RedisService";

(async () => {
  await MongooseService.init();
  const server = await API.init();
  const wsHandler = new WsHandler();
  wsHandler.init();
  SocketIO.init(server);
  RedisService.init();
})();