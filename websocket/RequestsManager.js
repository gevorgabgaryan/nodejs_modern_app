import AuthService from "../serveces/authService";
import {wsTokenSchema} from "../validators/wsValidatorSchemas";
import {WsValidator} from "./wsValidator";
import {UserManager} from "./UserManager";
import UserService from "../serveces/UserService";
import {serializeUser} from "passport";

export class RequestsManager {
  constructor() {
    this.callsList = {};
    this.wsValidator = new WsValidator();
    this.userManager = new UserManager();
  }

  initCalls() {
    this.registerCall(
      "authorize",
      "wsToken",
      wsTokenSchema,
      null,
      async (socket, params, roles) => {
        try {
          const {token} = params;
          const {userId} = await AuthService.checkToken(token, roles);
          this.userManager.addAuthorized(userId.toString(), socket);
          socket.userId = userId;
          this.send(socket, {message: "Successfully authorized"});
        } catch (e) {
          console.log(e);
          socket.send(
            JSON.stringify({
              error: true,
              message: "unauthorized",
            })
          );
        }
      }
    );
    this.registerCall(
      "userInfo",
      null,
      null,
      ["user"],
      async (socket, params, roles) => {
        try {
          if (!roles) {
            this.send(socket, {message: "System error"});
          }

          //checking autentication
          if (!this.userManager.authorizedUsersSockets[socket.userId]) {
            return this.send(socket, {message: "Unauthorized"});
          }

          const user = await UserService.findById(socket.userId);
          //checking authorization
          if (!roles.includes(user.role)) {
            return this.send(socket, {message: "Access denied"});
          }
          this.send(socket, {email: user.email});
        } catch (e) {
          console.log(e);
          socket.send(
            JSON.stringify({
              error: true,
              message: "System error",
            })
          );
        }
      }
    );
  }

  registerCall(callName, validateSchemaName, schema, roles, callback) {
    this.callsList[callName] = {
      validateSchemaName,
      callback,
      roles,
    };
    this.wsValidator.addSchema(validateSchemaName, schema);
  }

  async handleRequests(socket, data) {
    const dataObj = JSON.parse(data.toString());
    const eventName = dataObj.event;
    if (!eventName) {
      return this.send(socket, {
        error: true,
        message: "Event name required",
      });
    }

    if (typeof eventName !== "string") {
      return this.send(socket, {
        error: true,
        message: `Invalid event name ${eventName}`,
      });
    }

    const callObj = this.callsList[eventName];
    if (!callObj) {
      return this.send(socket, {error: true, message: "Unexpected event"});
    }

    try {
      if (callObj.validateSchemaName) {
        const params = dataObj.params;
        if (!params) {
          return this.send(socket, {error: true, message: "Params required"});
        }
        const {error} = this.wsValidator.validate(
          params,
          callObj.validateSchemaName
        );
        if (error) {
          console.log(error);
          return this.send(socket, error);
        }
      }

      const result = await callObj.callback(
        socket,
        dataObj.params,
        callObj.roles
      );
      if (result) {
        this.send(socket, result);
      }
    } catch (e) {
      this.send(socket, {error: true, message: e.message});
    }
  }

  send(socket, message) {
    const data = JSON.stringify(message);
    socket.send(data);
  }
}
