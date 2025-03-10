import { Global, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './nodemailer/nodemailer.service';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { AuthService } from './auth/auth.service';


@Global()
@Module({
  imports: [UserModule,
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
  ],
  controllers: [ProductsController],
  providers: [UserService, PrismaService, MailerService, RedisService,JwtService, ProductsService, AuthService],
})
export class AppModule {}
