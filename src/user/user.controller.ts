import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/DTO/user.dto';
import { http } from 'winston';

@Controller('/api/users/')
export class UserController {
    constructor(
        private userService: UserService
    ){}


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
            }, HttpStatus.BAD_REQUEST);        }
        
    }
}
