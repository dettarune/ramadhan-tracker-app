import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { CreateUserDTO } from 'src/DTO/user.dto';
import { MailerService } from 'src/nodemailer/nodemailer.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private mailServ: MailerService,
        private prismaServ: PrismaService
    ) { }


    async signUp(req: CreateUserDTO) {

        const taken = await this.prismaServ.user.findFirst({
            where:
            {
                OR: [
                    { username: req.username },
                    { email: req.email }
                ]
            }
            ,
            select: {
                username: true, 
                email: true
            }
        })

        if(taken){
            if(taken.username === req.username){
                throw new HttpException(`Username sudah terdaftar`, 401)
            } else if(taken.email === req.email){
                throw new HttpException(`Email sudah terdaftar`, 409)
            }
        }

        const user = await this.prismaServ.user.create({
            data: {
                username: req.username,
                password: await bcrypt.hash(req.password, 10),
                email: req.email
            }
        })

        

        return  

    }

}
