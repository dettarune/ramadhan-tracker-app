import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO, recoveryDTO } from 'src/DTO/user.dto';
import { http } from 'winston';
import { RedisService } from 'src/redis/redis.service';
import { Response } from 'express';
import { PassThrough } from 'stream';
import { MailerService } from 'src/nodemailer/nodemailer.service';

@Controller('/api/users/')
export class UserController {
    constructor(
        private userService: UserService,
        private redisServ: RedisService,
        private MailerService: MailerService
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
            res.cookie("user-token", result.token)
            console.log
            return result
        } catch (error) {
            console.error(error.message)
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('recovery')
    async recovery(
        @Body() req: recoveryDTO
    ){
        
        try {
           const result  = this.userService.recovery(req)
           return {
                message: `Succes Send Recovery Token To: ${req.email}`
           }
        } catch (error) {
            console.log(error)
            throw new HttpException(error.message, error.BAD_REQUEST)
        }

        }
    }
