import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from 'src/nodemailer/nodemailer.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, MailerService]
})
export class UserModule {}
