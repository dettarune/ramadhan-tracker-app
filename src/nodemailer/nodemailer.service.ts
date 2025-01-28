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

    async sendMail(targetEmail: string, subject: string, token, ): Promise<any>{
        try {
            this.transporter.sendMail({
                from: 'Detta',
                to: targetEmail,
                subject: subject,
                html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h1>Your Verification Code</h1>
                    <p>KODE HANGUS DALAM 5 MENIT</p>  
                    <p>Use the token below to verify your account:</p>  <br>          
    
                    <h1 style="color: #4CAF50;">${token}</h1>
                    <p>If you didn't request this, you can ignore this email.</p>
                </div>
            ` 
            })
        } catch (error) {
            console.log(error)
        }
    }

}
