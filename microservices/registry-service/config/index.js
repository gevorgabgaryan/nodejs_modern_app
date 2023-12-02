import { config } from 'dotenv'
config()

const Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: 8008,
  mongoDB: {
    url: process.env.MONGO_DB_URL
  },
  serviceName: 'catalog service',
  serviceVersion: '1.0.0'
}

export default Config