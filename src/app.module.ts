import { Global, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { ConfigModule } from '@nestjs/config';


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
  })
  ],
  controllers: [],
  providers: [UserService, PrismaService],
})
export class AppModule {}
