import express from "express";
import Config from "./config";
import MongooseService from "./databases/mongoose";

const app = express();

//init mongoDb connection
(async() =>{
  await MongooseService.init();
})();

app.get('/', (req, res) => {
    res.json({message: "Hello world"});
})

app.listen(Config.port, ()=>{
    console.log(`app start on port ${Config.port}`)
})
