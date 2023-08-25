import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from '../email.controller';
import { EmailService } from '../email.service';
import { createMock } from '@golevelup/ts-jest';
import { PostSendEmailReq } from '../dto/request/post.send-email.req';
import { PostSendEmailRes } from '../dto/response/post.send-email.res';

describe('EmailController', () => {
    let emailController: EmailController;
    let emailService: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmailController],
            providers: [{ provide: EmailService, useValue: createMock<EmailService>() }],
        }).compile();

        emailController = module.get<EmailController>(EmailController);
        emailService = module.get<EmailService>(EmailService);
    });

    it('should be defined', () => {
        expect(emailController).toBeDefined();
    });

    describe('sendTestEmail', () => {
        it('sendTestEmail 이 정의되어 있다.', () => {
            expect(emailController.sendTestEmail).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PostSendEmailReq('test@email.com', 'testemail', 'hello');
            const resDto = new PostSendEmailRes('test@email.com', 'testemail');
            emailService.sendVerificationEmail = jest.fn().mockResolvedValue(resDto);
            const result = await emailController.sendTestEmail(reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });
});
