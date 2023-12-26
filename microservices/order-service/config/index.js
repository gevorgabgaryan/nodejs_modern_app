import { config } from "dotenv"
import path from "path"
import pkg from "../package.json"
config()

const Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3115,
  JWTSecret: process.env.JWTSECRET,
  SendgridAPIKey: process.env.SENDGRID_API_KEY,
  mysql: {
    options: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DB_NAME,
      dialect: "mysql",
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
    },
    client: null,
  },
  registry: {
    url: "http://localhost:8008/register",
    verion: "*",
  },
  serviceName: pkg.name,
  serviceVersion: pkg.version,
}

export default Config
