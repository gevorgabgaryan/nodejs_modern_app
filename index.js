import MongooseService from "./databases/mongoose";
import API from "./API/API";
import WsHandler from "./websocket/WsHandler";

(async () => {
  await MongooseService.init();
  await API.init();
  const wsHandler = new WsHandler();
  wsHandler.init();
})();
