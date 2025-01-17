import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { CreateUserDTO, LoginUserDTO, recoveryDTO } from 'src/DTO/user.dto';
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
                if (taken.username === req.username) {
                    throw new HttpException(`Username sudah terdaftar`, 401)
                } else if (taken.email === req.email) {
                    throw new HttpException(`Email sudah terdaftar`, 409)
                }
            }

            const token = uuidv4().replace(/\D/g, '').slice(0, 6)

            const user = await this.prismaServ.user.create({
                data: {
                    username: req.username,
                    password: await bcrypt.hash(req.password, 10),
                    email: req.email
                }
            })

            await this.mailerService.sendMail(user.email, `${user.username}, KODE VERIFIKASI SEKALI PAKAI`, `
                    <div style="font-family: Arial, sans-serif; text-align: center;">
                        <h1>Your Verification Code</h1>
                        <p>KODE HANGUS DALAM 5 MENIT</p>  
                        <p>Use the token below to verify your account:</p>  <br>          

                        <h1 style="color: #4CAF50;">${token}</h1>
                        <p>If you didn't request this, you can ignore this email.</p>
                    </div>
                `)

            this.redisService.setTTL(`verif-code-${user.email}`, token, 5 * 60 * 1000)
            console.log(this.redisService.get('verif-code'))

            return {
                message: `Akun Dengan Username ${user.username} Berhasil Didaftarkan, Silahkan Cek Email untuk Verifikasi`,
                data: user
            }
        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message || 'Terjadi kesalahan', HttpStatus.BAD_REQUEST);
        }

    }

    async login(req: LoginUserDTO) {

        try {

            const user = await this.prismaServ.user.findFirst({
                where: { username: req.username },
                select: { username: true, password: true, email: true }
            })

            const isPasswordTrue = bcrypt.compare(req.password, user.password)

            if (!isPasswordTrue) {
                throw new HttpException(`Username or password is incorrect`, 404);
            }

            const verifCode = await this.redisService.get(`verif-code-${req.email}`)

            if (req.token !== verifCode) {
                throw new HttpException(`Token Invalid`, 401)
            }

            const jwtSign = await this.jwtService.sign(
                { username: req.username, email: req.email },
                { secret: process.env.SECRET_JWT }
            )

            return {
                message: "Login Succes!",
                token: jwtSign
            }

        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, 401)
        }

    }

    async recovery(req: recoveryDTO) {

        try {

            const findEmail = await this.prismaServ.user.findFirst({
                where: { email: req.email },
                select: { email: true }
            })

            if (!findEmail) {
                throw new HttpException(`Email Not Found in our databases`, 404)
            }

            const token = await uuidv4().replace(/\D/g, '').slice(0, 6)

            await this.mailerService.sendMail(req.email, `${req.email}, KODE RECOVERY SEKALI PAKAI`, `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h1>Your Verification Code</h1>
                    <p>KODE HANGUS DALAM 5 MENIT</p>  
                    <p>Use the token below to verify your account:</p>  <br>          
    
                    <h1 style="color: #4CAF50;">${token}</h1>
                    <p>If you didn't request this, you can ignore this email.</p>
                </div>
            `)

            this.redisService.setTTL(`recovery-code-${req.email}`, token, 5 * 60 * 1000)

            return { token }
        } catch (error) {
            console.error(error.message)
        }
    }

    async forgot() {

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