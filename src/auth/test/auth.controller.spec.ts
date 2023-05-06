import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { PostEmailReq } from '../dto/request/post.email.req';
import { PostEmailRes } from '../dto/response/post.email.res';
import { PostNicknameReq } from '../dto/request/post.nickname.req';
import { PostNicknameRes } from '../dto/response/post.nickname.res';
import { PostSignUpReq } from '../dto/request/post.signup.req';
import { PostSignUpRes } from '../dto/response/post.signup.res';
import { now } from 'src/lib/utils/dates/date.utils';
import { Role } from '@prisma/client';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    const email = 'abcdefg@test.com';
    const nickname = 'test';
    const password = 'password';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: createMock<AuthService>() },
                { provide: UserRepository, useValue: createMock<UserRepository>() },
                { provide: ProfileRepository, useValue: createMock<ProfileRepository>() },
                { provide: PrismaService, useValue: createMock<PrismaService>() },
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
        it('Service 의 리턴값을 반환한다.', async () => {
            const reqDto = new PostEmailReq(email);
            const resDto = new PostEmailRes(true);
            authService.checkDuplicateEmail = jest.fn().mockResolvedValue(resDto);
            const result = await authController.checkDuplicateEmail(reqDto);
            expect(result).toBe(resDto);
        });
    });

    describe('checkDuplicateNickname', () => {
        it('checkDuplicateNickname 이 정의되어 있다.', () => {
            expect(authController.checkDuplicateNickname).toBeDefined();
        });
        it('Service 의 리턴값을 반환한다.', async () => {
            const reqDto = new PostNicknameReq(nickname);
            const resDto = new PostNicknameRes(false);
            authService.checkDuplicateNickname = jest.fn().mockResolvedValue(resDto);
            const result = await authController.checkDuplicateNickname(reqDto);
            expect(result).toBe(resDto);
        });
    });

    describe('signUp', () => {
        it('signUp 이 정의되어 있다.', () => {
            expect(AuthController.signUp).toBeDefined();
        });
        it('Service 의 리턴값을 반환한다.', async () => {
            const mockedUser = {
                userId: 1,
                email,
                nickname,
                password,
                role: Role.USER,
                registeredAt: now(),
                updatedAt: now(),
                deletedAt: null,
            };
            const reqDto = new PostSignUpReq(email, nickname, password);
            const resDto = new PostSignUpRes(mockedUser);
            authService.signUp = jest.fn().mockResolvedValue(resDto);
            const result = await authController.signUp(reqDto);
            expect(result).toBe(resDto);
        });
    });
});
