import { Logger, Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
    providers: [{
        provide: 'RedisClient',
        useFactory: () => new Redis({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
        }).on('error', (e) => Logger.error(`Redis Connection Error: ${e}`))
    },
    ],
    exports: ['RedisClient']
})
export class RedisModule { }
