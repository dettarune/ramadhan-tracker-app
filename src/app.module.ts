import { Global, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { RamadhanModule } from './ramadhan/ramadhan.module';

@Global()
@Module({
  imports: [
    UserModule,
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    RedisModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: "10d" }
    }),
    RamadhanModule 
  ],
  providers: [PrismaService, AuthService],
})
export class AppModule {}
