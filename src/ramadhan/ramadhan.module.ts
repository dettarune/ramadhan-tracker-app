import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { RamadhanService } from './ramadhan.service';
import { RamadhanController } from './ramadhan.controller';

@Module({
  imports: [RedisModule],
  controllers: [RamadhanController],
  providers: [RamadhanService, PrismaService, RedisService],
  exports: [RamadhanService] // Tambahkan ini agar bisa dipakai di AppModule
})
export class RamadhanModule {}
