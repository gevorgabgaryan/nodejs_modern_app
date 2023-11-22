import { Redis } from "ioredis";
import Config from "../config";

class RedisService {
    static async init() {
        const redis = new Redis(Config.redis.port);
        redis.on('connect', ()=>{
            console.log('connected to Redis');
        });
        redis.createBuiltinCommand('error', (e)=>{
            console.log(e);
            process.exit(1);
        })
        Config.redis.client = redis;
        return redis;
    }
}

export default RedisService;

