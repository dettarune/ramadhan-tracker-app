import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { CreateUserDTO, emailDTO, LoginUserDTO, verifyTokenDTO } from 'src/user/DTO/user.dto';
import { MailerService } from 'src/nodemailer/nodemailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { http } from 'winston';

@Injectable()
export class UserService {
    constructor(
        private mailerService: MailerService,
        private prismaServ: PrismaService,
        private redisService: RedisService,
        private jwtService: JwtService
    ) { }


    async signUp(req: CreateUserDTO) {

        try {

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

            if (taken) {
                const errorMessage =
                    taken.username === req.username
                        ? 'Username sudah terdaftar'
                        : 'Email sudah terdaftar';
            
                const errorCode = taken.username === req.username ? 401 : 409;
            
                throw new HttpException(errorMessage, errorCode);
            }

            const token = uuidv4().replace(/\D/g, '').slice(0, 6)

            const user = await this.prismaServ.user.create({
                data: {
                    username: req.username,
                    password: await bcrypt.hash(req.password, 10),
                    email: req.email
                }
            })

            await this.mailerService.sendMail(user.email, `${user.email}, KODE RECOVERY SEKALI PAKAI`, token)

            await this.redisService.setTTL(`verif-code-${user.email}`, token, 5 * 60 * 1000)
            await this.redisService.setTTL(`username-${user.email}`, user.username, 5 * 60 * 1000)
            await this.redisService.setTTL(`role-${user.email}`, user.role, 5 * 60 * 1000)

            return {
                user,
                email: user.email
            }
        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, error.code)
        }

    }


    async login(req: LoginUserDTO) {

        try {
            const token = await uuidv4().replace(/\D/g, '').slice(0, 6)
            const user = await this.prismaServ.user.findFirst({
                where: { username: req.username },
                select: { username: true, password: true, email: true, role: true }
            })

            const isPasswordTrue = await bcrypt.compare(req.password, user.password)

            if (!isPasswordTrue) 
                throw new HttpException(`Username or password is incorrect`, 404);
            

            await this.mailerService.sendMail(user.email, `${user.username}, KODE RECOVERY SEKALI PAKAI`, token)

            //redis more info to verify
            await this.redisService.setTTL(`verif-code-${user.email}`, token, 5 * 60 * 1000)
            await this.redisService.setTTL(`username-${user.email}`, user.username, 5 * 60 * 1000)
            await this.redisService.setTTL(`role-${user.email}`, user.role, 5 * 60 * 1000)

            return {
                message: `Succes Send Verif Token To: ${user.email}`,
                email: user.email
            }   

        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, error.code)
        }

    }


    async recovery(req: emailDTO) {

        try {

            const findEmail = await this.prismaServ.user.findFirst({
                where: { email: req.email },
                select: { email: true }
            })

            if (!findEmail) {
                throw new HttpException(`Email Not Found in our databases`, 404)
            }

            const token = await uuidv4().replace(/\D/g, '').slice(0, 6)

            await this.mailerService.sendMail(req.email, `${req.email}, KODE RECOVERY SEKALI PAKAI`, token)


            this.redisService.setTTL(`recovery-code-${req.email}`, token, 5 * 60 * 1000)

            return {
                message: `Succes Send Recovery Token To: ${req.email}`
            }       
         } catch (error) {
            console.error(error.message)
        }
    }


    async verify(email: emailDTO, token: verifyTokenDTO) {

        const verifCode = await this.redisService.get(`verif-code-${email}`)
        const username = await this.redisService.get(`username-${email}`)
        const role = await this.redisService.get(`role-${email}`)

        console.log('Redis verifCode:', verifCode);
        console.log('Received email:', email);
        console.log('Received token:', token);
        console.log('Received uname:', username);

        if (token.token !== verifCode) 
            throw new HttpException(`Token Invalid`, 401)
        

        const jwtToken = await this.jwtService.sign(
            { username: username, email: email, role: role },
            { secret: process.env.SECRET_JWT, expiresIn: '7d' }
        );

        await this.redisService.delToken(`verif-code-${email}`)
        await this.redisService.delToken(`username-${email}`)
        await this.redisService.delToken(`role-${email}`)

        return { jwtToken }
    }

}



@Injectable()
export class PersegiPanjang {

    hitungLuas(panjang, lebar) {
        return panjang * lebar
    }

    hitungKeliling(panjang, lebar) {
        return 2 * (panjang + lebar)
    }

}