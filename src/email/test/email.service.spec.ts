import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { createMock } from '@golevelup/ts-jest';
import { PostSendEmailReq } from '../dto/request/post.send-email.req';
import { PostSendEmailRes } from '../dto/response/post.send-email.res';
import { EmailServiceExecutionFailedException } from 'src/lib/exceptions/email.exception';

describe('EmailService', () => {
    let emailService: EmailService;
    let mailSender: MailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: MailerService, useValue: createMock<MailerService>() },
            ],
        }).compile();

        emailService = module.get<EmailService>(EmailService);
        mailSender = module.get<MailerService>(MailerService);
    });

    it('should be defined', () => {
        expect(emailService).toBeDefined();
    });

    describe('sendVerificationEmail', () => {
        it('sendVerificationEmail 이 정의되어 있다.', () => {
            expect(emailService.sendVerificationEmail).toBeDefined();
        });
        it('전송한 메일의 제목과 내용을 리턴한다.', async () => {
            const resDto = new PostSendEmailRes('test@email.com', 'testemail');
            mailSender.sendMail = jest.fn();
            const result = await emailService.sendVerificationEmail(
                'test@email.com',
                'testemail',
                'hello',
            );
            expect(result).toStrictEqual(resDto);
        });
        it('메일 전송에 실패했을 경우, EmailServiceExecutionFailedException 를 발생', async () => {
            mailSender.sendMail = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = async () =>
                await emailService.sendVerificationEmail('test@email.com', 'testemail', 'hello');
            expect(result).rejects.toThrowError(new EmailServiceExecutionFailedException());
        });
    });
});
