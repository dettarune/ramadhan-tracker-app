import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/DTO/user.dto';
import { http } from 'winston';
import { RedisService } from 'src/redis/redis.service';

@Controller('/api/users/')
export class UserController {
    constructor(
        private userService: UserService,
        private redisServ: RedisService
    ) { }


    @Post('')
    async signUp(
        @Body() req: CreateUserDTO
    ) {

        try {
            console.log(await this.redisServ.get('verif-code'))
            return this.userService.signUp(req)
        } catch (error) {
            console.error(error.message)
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            }, HttpStatus.BAD_REQUEST);
        }

    }
}
