import express from "express";
import Config from "./config";

const app = express();

app.get('/', (req, res) => {
    res.json({message: "Hello world"});
})

app.listen(Config.port, ()=>{
    console.log(`app start on port ${Config.port}`)
})
