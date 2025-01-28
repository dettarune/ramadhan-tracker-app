import { Body, Controller, Get, Headers, HttpCode, HttpException, HttpStatus, Param, Post, Res, UseFilters } from '@nestjs/common';
import { PersegiPanjang, UserService } from './user.service';
import { CreateUserDTO, emailDTO, LoginUserDTO, verifyTokenDTO } from 'src/DTO/user.dto';
import { http } from 'winston';
import { RedisService } from 'src/redis/redis.service';
import { Response } from 'express';
import { PassThrough } from 'stream';
import { MailerService } from 'src/nodemailer/nodemailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpExceptionFilter } from 'src/error/error.filters';

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
        @Body() req: CreateUserDTO,
        @Res({ passthrough: true }) res: Response
    ) {

        try {
            res.setHeader('email', req.email)
            res.status(201)
            const result = await this.userService.signUp(req)
            return {
                data: result,
                message: `Sukses membuat akun dengan username ${result.user.username}`
            }
        } catch (error) {
            console.error(error.message)
            if (error instanceof HttpException) {
                throw new HttpException(error.getResponse(), error.getStatus());
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('/verify')
    async verify(
        @Headers('email') email: emailDTO,
        @Body() req: verifyTokenDTO
    ) {

        try {
            const result = await this.userService.verify(email, req)
            return {
                message: "Login Success!",
                token: result.jwtToken
            }

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw new HttpException(error.getResponse(), error.getStatus());
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    @Post('/login')
    async login(
        @Body() req: LoginUserDTO,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            const result = await this.userService.login(req)
            res.setHeader('email', result.email)
            return {
                message: `Succes Send Verif Token To: ${result.email}`
            }
        } catch (error) {
            console.error(error.messagee)
            if (error instanceof HttpException) {
                throw new HttpException(error.getResponse(), error.getStatus());
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    @Get('/:id')
    async getUserById(@Param('id') id: string) {

        try {
            const user = await this.prismaServ.user.findUnique({
                where: { id: parseInt(id, 10) }
            })

            if (!user) {
                throw new HttpException('User not found', 404);
            }

            return {
                data: {
                    user
                }
            }
        } catch (error) {
            console.error(error.message)
            if (error instanceof HttpException) {
                throw new HttpException(error.getResponse(), error.getStatus());
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    @Post('/recovery')
    async recovery(
        @Body() req: emailDTO
    ) {

        try {
            const result = this.userService.recovery(req)
            return {
                message: `Succes Send Recovery Token To: ${req.email}`
            }
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw new HttpException(error.getResponse(), error.getStatus());
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
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
