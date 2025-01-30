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
            await this.redisService.setTTL(`id-${user.email}`, user.id, 5 * 60 * 1000)

            return {
                email: user.email,
                username: user.username
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
                select: { username: true, password: true, email: true, role: true, id: true }
            })

            const isPasswordTrue = await bcrypt.compare(req.password, user.password)

            if (!isPasswordTrue)
                throw new HttpException(`Username or password is incorrect`, 404);


            await this.mailerService.sendMail(user.email, `${user.username}, KODE RECOVERY SEKALI PAKAI`, token)

            //redis more info to verify
            await this.redisService.setTTL(`verif-code-${user.email}`, token, 5 * 60 * 1000)
            await this.redisService.setTTL(`username-${user.email}`, user.username, 5 * 60 * 1000)
            await this.redisService.setTTL(`role-${user.email}`, user.role, 5 * 60 * 1000)
            await this.redisService.setTTL(`id-${user.email}`, user.id, 5 * 60 * 1000)


            return {
                message: `Succes Send Verif Token To: ${user.email}`,
                email: user.email
            }

        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, error.code)
        }

    }

    async getInfoMe(username: any) {

        try {

            const user = await this.prismaServ.user.findUnique({
                where: { username },
            })

            if (!user)
                throw new HttpException(`User Not Found`, 404)

            const createdAt = new Date(user.created_at);
            const now = new Date();

            const usia = now.getTime() - createdAt.getTime();

            const usiaAkun = Math.floor(usia / (1000 * 60 * 60 * 24));

            return { user, usiaAkun: usiaAkun };
        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, error.code)
        }

    }

    // async updateUser(reqProduct: updateProductDTO, id: number): Promise<any> {
    //         try {
    //             const product = await this.prismaServ.products.update({
    //                 where: { id: id },
    //                 data: {
    //                     ...reqProduct,
    //                     updated_at: new Date()
    //                 }
    //             });

    //             if (!product)
    //                 throw new HttpException(`Product Not Found`, 404)

    //             console.log(product)

    //             return product
    //         } catch (error) {
    //             console.log(error.message);
    //             throw new HttpException(error.message, error.code)

    //         }
    //     }

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
            throw new HttpException(error.message, error.code)

        }
    }


    async verify(email: emailDTO, token: verifyTokenDTO) {
        try {
            const verifCode = await this.redisService.get(`verif-code-${email}`)
            const username = await this.redisService.get(`username-${email}`)
            const role = await this.redisService.get(`role-${email}`)
            const id = await this.redisService.get(`id-${email}`)


            if (!token)
                throw new HttpException(`User Not Found`, 404)


            if (token.token !== verifCode)
                throw new HttpException(`Token Invalid`, 401)


            const jwtToken = await this.jwtService.sign(
                { id: id, username: username, email: email, role: role },
                { secret: process.env.SECRET_JWT, expiresIn: '7d' }
            );

            await this.redisService.delToken(`verif-code-${email}`)
            await this.redisService.delToken(`username-${email}`)
            await this.redisService.delToken(`role-${email}`)
            await this.redisService.delToken(`id-${email}`)

            return { jwtToken }
        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, error.code)

        }

    }

    async logOut(reqUser: any): Promise<any> {
        try {
            const user = this.prismaServ.user.findUnique({
                where: { username: reqUser }, select: { username: true }
            })

            if (!user)
                throw new HttpException(`User Not Found`, 404)
        } catch (error) {
            console.error(error.message)
            throw new HttpException(error.message, error.code)

        }

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