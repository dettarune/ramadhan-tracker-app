import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/error/error.filters';
import { RamadhanService } from './ramadhan.service';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/guard/user.guard';
import { SholatDTO, TadarusDTO } from 'src/dto/ramadhan.dto';

@Controller('/api/ramadhan')
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard)
export class RamadhanController {
    constructor(
        private service: RamadhanService,
        private redisServ: RedisService,
        private prismaServ: PrismaService
    ) { }


    @Post('/sholat')
    async addSholat(userId: any, @Body() sholatData: SholatDTO) {
        const result = this.service.addSholat(userId, sholatData)

        return {
            status: 200,
            message: "Succes Add Data!",
            data: result
        }
    }


    @Post('/tadarus')
    async addTadarus(userId: any, @Body() tadarusData: TadarusDTO) {
        const result = this.service.addTadarus(userId, tadarusData)

        return {
            status: 200,
            message: "Succes Add Data!",
            data: result
        }
    }
}
