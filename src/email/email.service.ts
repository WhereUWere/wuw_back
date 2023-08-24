import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { email } from 'src/config/emailConfig';
import { EmailServiceExecutionFailedException } from 'src/lib/exceptions/email.exception';
import { PostSendEmailRes } from './dto/response/post.send-email.res';

@Injectable()
export class EmailService {
    private readonly transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: email.emailAddress,
                pass: email.emailPassword,
            },
        });
    }

    async sendVerificationEmail(
        to: string,
        subject: string,
        content: string,
    ): Promise<PostSendEmailRes> {
        try {
            await this.transporter.sendMail({
                from: email.emailAddress,
                to,
                subject,
                text: content,
            });

            return new PostSendEmailRes(to, subject);
        } catch (error) {
            throw new EmailServiceExecutionFailedException();
        }
    }
}
