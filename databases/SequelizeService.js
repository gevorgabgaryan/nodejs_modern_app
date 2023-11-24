import Sequelize from "sequelize";
import Config from "../config";
import Models from "../models/sequelize";

class SequelizeService {
  static async init() {
    try {
      const sequelize = new Sequelize(Config.mysql.options);
      sequelize.authenticate();
      console.log("Successfully connected to MySQL");
      Config.mysql.client = sequelize;
      Models(sequelize);
      return sequelize
    } catch (e) {
      console.log(`Sequelize connection error`);
      console.log(e);
      //process.exit(1);
    }
  }
}

export default SequelizeService;
