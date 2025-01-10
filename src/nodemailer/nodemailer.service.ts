import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;
    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            ignoreTLS: false,
            secure: false,
            auth: {
                user: this.configService.get('MAIL_HOST'),
                pass: this.configService.get('MAIL_PW')
            },
        });
    }

    async sendMail(targetEmail: string, subject: string, messageHTML: string, ): Promise<any>{
        try {
            this.transporter.sendMail({
                from: `DETARUNE - ${this.configService.get('MAIL_HOST')}`,
                to: targetEmail,
                subject: subject,
                html: messageHTML 
            })
        } catch (error) {
            console.log(error)
        }
    }

}
