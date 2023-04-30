import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { PostEmailReq } from '../dto/request/post.email.req';
import { PostEmailRes } from '../dto/response/post.email.res';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: UserRepository,
                    useValue: createMock<UserRepository>(),
                },
                {
                    provide: ProfileRepository,
                    useValue: createMock<ProfileRepository>(),
                },
                {
                    provide: PrismaService,
                    useValue: createMock<PrismaService>(),
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('checkDuplicateEmail', () => {
        it('checkDuplicateEmail 이 정의되어 있다.', () => {
            expect(authController.checkDuplicateEmail).toBeDefined();
        });
        it('Service 를 호출한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@test.com');
            authService.checkDuplicateEmail = jest.fn();
            await authController.checkDuplicateEmail(reqDto);
            expect(authService.checkDuplicateEmail).toBeCalledTimes(1);
            expect(authService.checkDuplicateEmail).toBeCalledWith(reqDto);
        });
        it('이메일이 존재할 경우, true 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@test.com');
            const resDto = new PostEmailRes(true);
            authService.checkDuplicateEmail = jest.fn().mockResolvedValue(resDto);
            expect(await authController.checkDuplicateEmail(reqDto)).toBe(resDto);
        });
        it('이메일이 존재하지 않을 경우, false 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@test.com');
            const resDto = new PostEmailRes(true);
            authService.checkDuplicateEmail = jest.fn().mockResolvedValue(resDto);
            expect(await authController.checkDuplicateEmail(reqDto)).toBe(resDto);
        });
    });
});
