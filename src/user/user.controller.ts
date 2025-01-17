import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { PersegiPanjang, UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO, recoveryDTO } from 'src/DTO/user.dto';
import { http } from 'winston';
import { RedisService } from 'src/redis/redis.service';
import { Response } from 'express';
import { PassThrough } from 'stream';
import { MailerService } from 'src/nodemailer/nodemailer.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/api/users/')
export class UserController {
    constructor(
        private userService: UserService,
        private redisServ: RedisService,
        private MailerService: MailerService,
        private persegiPanjang: PersegiPanjang,
        private prismaServ: PrismaService
    ) { }


    @Post('')
    async signUp(
        @Body() req: CreateUserDTO
    ) {

        try {
            return this.userService.signUp(req)
        } catch (error) {
            console.error(error.message)
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            }, HttpStatus.BAD_REQUEST);
        }

    }

    @Post('/login')
    async login(
        @Body() req: LoginUserDTO,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            const result = await this.userService.login(req)
            res.header("user-token", result.token)
            console.log
            return result
        } catch (error) {
            console.error(error.messagee)
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }


    @Get('/:id')
    async getUserById(@Param('id') id: string) {

        try {
            const user = await this.prismaServ.user.findUnique({
                where: {id: parseInt(id, 10) }
            })
    
            if (!user) {
                throw new HttpException('User not found', 404); // Jika user tidak ditemukan
            }

            return {
                userInfo: {
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    created_at: user.created_at,
                    money: user.budget
                }
            }  
        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, 500)
        }
    }

    @Post('recovery')
    async recovery(
        @Body() req: recoveryDTO
    ) {

        try {
            const result = this.userService.recovery(req)
            return {
                message: `Succes Send Recovery Token To: ${req.email}`
            }
        } catch (error) {
            console.log(error)
            throw new HttpException(error.message, error.BAD_REQUEST)
        }
    }

    @Get('/hitung/persegipanjang/:option/:panjang/:lebar')
    hitung(
        @Param('panjang') panjang,
        @Param('lebar') lebar,
        @Param('option') option
    ) {
        let hasil;
        if (option === 'luas') {

            hasil = this.persegiPanjang.hitungLuas(panjang, lebar)
            return `Luas dari persegi panjang yang memiliki panjang = ${panjang}cm dan lebar = ${lebar}cm adalah === ${hasil}cm`

        } else if (option === 'keliling') {


            hasil = this.persegiPanjang.hitungKeliling(panjang, lebar)
            return `Keling dari persegi panjang yang memiliki panjan  ${panjang}cm dan lebar = ${lebar}cm adalah === ${hasil}cm`

        } else {
            return `Hanya menerima option keliling dan luas`
        }

    }
}
