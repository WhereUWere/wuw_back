import { Injectable } from '@nestjs/common';
import { email } from 'src/config/emailConfig';
import { EmailServiceExecutionFailedException } from 'src/lib/exceptions/email.exception';
import { PostSendEmailRes } from './dto/response/post.send-email.res';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailSender: MailerService) {}

    async sendVerificationEmail(
        to: string,
        subject: string,
        content: string,
    ): Promise<PostSendEmailRes> {
        try {
            await this.mailSender.sendMail({
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
