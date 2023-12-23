import { config } from 'dotenv'
import path from 'path'
import pkg from '../package.json'
config()

const Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3115,
  wsPort: process.env.WS_PORT || 1990,
  mongoDB: {
    url: process.env.MONGO_DB_URL
  },
  JWTSecret: process.env.JWTSECRET,
  SendgridAPIKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL,
  userRoles: ['user', 'admin', 'editor'],
  userStatuses: ['new', 'active', 'inactive'],
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  redis: {
    port: process.env.REDIS_PORT || 6379,
    client: null
  },
  mysql: {
    options: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DB_NAME,
      dialect: 'mysql',
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD
    },
    client: null
  },
  userPhotosDir: path.join(__dirname, '../public/images/users'),
  testUser: process.env.TEST_USER,
  testPassword: process.env.TEST_PASWORD,
  registry: {
    url: 'http://localhost:8008/register',
    verion: '*'
  },
  serviceName: pkg.name,
  serviceVersion: pkg.version
}

export default Config
