import {Server} from "ws";
import http from "http";
import Config from "../config";
import {UserManager} from "./UserManager";
import { RequestsManager } from "./RequestsManager";

class WsHandler {

  async init() {
    const port = Config.wsPort;
    this.server = http.createServer();

    this.server.on("error", (err) => {
      console.log(`Websocket server error`, err);
    });

    this.server.on("close", () => {
      console.log("Websocket closed");
    });

    this.server.listen(port, () => {
      console.log(`WS server listening on port ${port}`);
    });

    this.wsServer = new Server({
      server: this.server,
    });

    this.userManager = new UserManager();
    this.requestsManager = new RequestsManager();
    this.requestsManager.initCalls();

    this.wsServer.on("connection", (socket, request) =>
      this.onSocketConnection(socket, request)
    );
  }

  onSocketConnection(socket, request) {
    console.log("New websocket connection");
    this.userManager.add(socket);
    socket.on(
      "message",
      async (data) => await this.onSocketMessage(socket, data)
    );
    socket.on("close", (code, reason) => this.onSocketClose(socket, code, reason));
  }

  async onSocketMessage(socket, data) {
    const payload = JSON.parse(data);

    console.log(`Received: `, payload);

    await this.requestsManager.handleRequests(socket, data);
  }

  onSocketClose(socket, code, reason) {
    console.log(`Client has disconnected; code ${code}, reason: ${reason}`);
    this.userManager.remove(socket);
  }

}

export default WsHandler;
