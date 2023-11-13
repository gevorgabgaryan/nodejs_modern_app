import express from "express";
import http from "http";
import Config from "../config";
import apiRoutes from "../routes/apiRoutes";
import SetupPassport from "../lib/passport";

class API {
  static async init() {
    const app = express();
    const passport = SetupPassport();

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(passport.initialize());
    app.use("/api", apiRoutes);

    app.use((req, res) => {
      console.log(`Request url ${req.url}`);
      res.json({message: "API not found"});
    });

    const server = http.createServer(app);

    const port = Config.port;

    server.listen(port, () => {
      console.log(`Rest server started on port: ${port}`);
    });
  }
}


export default API;