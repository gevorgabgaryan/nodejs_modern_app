import { Redis } from 'ioredis'
import Config from '../config'
import logger from '../shared/logger'

class RedisService {
  static async init () {
    const redis = new Redis(Config.redis.port)
    redis.on('connect', () => {
      logger.info('connected to Redis')
    })
    redis.createBuiltinCommand('error', (e) => {
      logger.error(e)
      process.exit(1);
    })
    Config.redis.client = redis
    return redis
  }

  static async disconnect () {
    if (Config.redis.client) {
      try {
        await Config.redis.client.quit()
        logger.info('Disconnected from Redis')
      } catch (error) {
        logger.error(`Error disconnecting from Redis: ${error}`)
      }
    }
  }
}

export default RedisService
