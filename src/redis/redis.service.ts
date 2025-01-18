import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('RedisClient') private redis: Redis) { }

    async set(key: string, value: any): Promise<any> {
        try {
            await this.redis.set(key, value)
        } catch (error) {
            console.error(error.message)
        }
    }

    async setTTL(key: string, value: any, ttl: number): Promise<any> {
        try {
            await this.redis.set(key, value, "EX",  Math.floor(ttl / 1000))
            return true
        } catch (error) {
            console.error(error.message)
            return false; 
        }
    }

    async delToken(key: string): Promise<any> {
        try {
            await this.redis.del(key);
            return true; 
        } catch (error) {
            console.error(error.message);
            return false; 
        }
    }
    

    async get(key: string): Promise<any>{
        try {
            return this.redis.get(key)
        } catch (error) {
            console.error(error.message)
        }
    }
}
