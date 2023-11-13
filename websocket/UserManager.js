import {WebSocket} from "ws";

export class UserManager {
  sockets = new Set();

  constructor() {
    if (!UserManager.instance) {
      this.authorizedUsersSockets = {};
      UserManager.instance = this;
    }
    return UserManager.instance;
  }

  add(socket) {
    this.sockets.add(socket);
  }

  remove(socket) {
    console.log(19, socket.userId);
    this.sockets.delete(socket);
    if (this.authorizedUsersSockets[socket.userId]) {
      const socketIndex =
        this.authorizedUsersSockets[socket.userId].indexOf(socket);
      if (socketIndex !== -1) {
        this.authorizedUsersSockets[socket.userId].splice(socketIndex, 1);
      }
    }
  }

  addAuthorized(userId, socket) {
    if (!this.authorizedUsersSockets[userId]) {
      this.authorizedUsersSockets[userId] = [];
    }
    this.authorizedUsersSockets[userId].push(socket);
  }

  sendToAll(message) {
    const data = JSON.stringify(message);
    this.sockets.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });
  }
}
