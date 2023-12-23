import MongooseService from "./databases/MongooseService";
import API from "./API/API";
import WsHandler from "./websocket/WsHandler";
import SocketIO from "./SocketIO/SocketIO";
import RedisService from "./databases/RedisService";
import SequelizeService from "./databases/SequelizeService";
import { errorHandler } from "./shared/errorHandler";
import logger from "./shared/logger";
import { BaseError } from "./shared/error";
import HttpStatusCode from "./shared/httpStatusCodes";
import Tracing from "./lib/tracing";
import Config from "./config";

(async () => {
  Tracing(`${Config.serviceName}:${Config.serviceVersion}`);
  await MongooseService.init();
  await SequelizeService.init();
  RedisService.init();
  const server = await API.init();
  const wsHandler = new WsHandler();
  wsHandler.init();
  SocketIO.init(server);
})();

const cleanup = async () => {
  await MongooseService.disconnect();
  await RedisService.disconnect();
};
process.on("exit", async (code) => {
  console.log(`About to exit with code: ${code}`);
  await cleanup();
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Cleaning up before exit...");
  await cleanup();
  process.exit();
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Cleaning up before exit...");
  await cleanup();
  process.exit();
});

process.on("unhandledRejection", (err) => {
  logger.warn(
    new BaseError(
      "unhandledRejection",
      HttpStatusCode.INTERNAL_SERVER,
      err,
      false,
    ),
  );
  throw err;
});

process.on("uncaughtException", (err) => {
  logger.error(
    logger.warn(
      new BaseError(
        "uncaughtException",
        HttpStatusCode.INTERNAL_SERVER,
        err,
        false,
      ),
    ),
  );
  errorHandler.handleError(err);
  if (!errorHandler.isTrustedError(err)) {
    process.exit(1);
  }
});
