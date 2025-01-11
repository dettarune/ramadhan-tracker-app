import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('RedisClient') private redisClient: Redis) {
        
    }
}
