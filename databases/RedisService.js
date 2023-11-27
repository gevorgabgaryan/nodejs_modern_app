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
      // process.exit(1);
    })
    Config.redis.client = redis
    return redis
  }
}

export default RedisService
