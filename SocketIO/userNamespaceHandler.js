import {onlineHandler, offlineHandler} from "./handlers";

const userNamespaseHandler = async (io, socket, userNamespace) => {
  try {
    socket.on("online", (callback) =>
      onlineHandler(socket, callback, userNamespace)
    );

    socket.on("disconnect", (reason) => {
      console.log(`disconnect ${socket.userId}`);
      console.log(`disconnect reason ${reason}`);
      offlineHandler(socket, userNamespace);
    });
    socket.join(socket, userNamespace);
  } catch (e) {
    console.error(e);
    socket.emit("error", "Unexpected error");
  }
};

export default userNamespaseHandler;


