import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PersegiPanjang, UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from 'src/nodemailer/nodemailer.service';
import { RedisService } from 'src/redis/redis.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [RedisModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: "7d" }
    })
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailerService, RedisService, JwtService, PersegiPanjang, AuthService]
})
export class UserModule { }
