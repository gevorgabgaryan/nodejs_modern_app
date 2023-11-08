import express from "express";
import Config from "./config";
import MongooseService from "./databases/mongoose";
import apiRoutes from "./routes/apiRoutes";

const app = express();

//init mongoDb connection
(async () => {
  await MongooseService.init();
})();

app.use(express.json());

app.use(express.urlencoded());

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.json({message: "API not found"});
});

app.listen(Config.port, () => {
  console.log(`app start on port ${Config.port}`);
});
