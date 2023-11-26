import express from "express";
import {createServer} from "http";
import Config from "../config";
import apiRoutes from "../routes/apiRoutes";
import SetupPassport from "../lib/passport";
import cors from "cors";

class API {
  static async init() {
    const app = express();
    const passport = SetupPassport();

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors());
    app.use(passport.initialize());
    app.use("/api", apiRoutes);

    app.use((req, res) => {
      console.log(`Request url ${req.url}`);
      res.json({message: "API not found"});
    });

    app.listen

    const server = createServer(app);

    const port = Config.port;

    server.listen(port, () => {
      console.log(`Rest server started on port: ${port}`);
    });
    return server;
  }
}


export default API;