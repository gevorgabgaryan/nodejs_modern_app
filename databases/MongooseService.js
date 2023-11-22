import mongoose from "mongoose";
import Config from "../config";

class MongooseService {
  static async init() {
    const url = Config.mongoDB.url;
    const db = mongoose.connection;

    db.on("connected", () => {
      console.log('connected to MongoDB');
    });
    db.on("error", (e) => {
      console.error('MongoDB connect error');
      console.log(e)
    });
    db.once("open", () => {
      console.log(`Mongo DB connecet`);
    });

    try {
      await mongoose.connect(`${url}/${Config.mongoDB.dbName}`);
    } catch (e) {
      console.log(`Mongo connection error`);
      console.log(e);
    }
  }
}

export default MongooseService;