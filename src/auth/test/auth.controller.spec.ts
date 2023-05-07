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
import { PostSignInReq } from '../dto/request/post.signin.req';
import { PostSignInRes } from '../dto/response/post.signin.res';
import { PostBreakOutReq } from '../dto/request/post.breakout.req';
import { PostBreakOutRes } from '../dto/response/post.breakout.res';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

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
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@test.com');
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
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PostNicknameReq('test');
            const resDto = new PostNicknameRes(false);
            authService.checkDuplicateNickname = jest.fn().mockResolvedValue(resDto);
            const result = await authController.checkDuplicateNickname(reqDto);
            expect(result).toBe(resDto);
        });
    });

    describe('signUp', () => {
        it('signUp 이 정의되어 있다.', () => {
            expect(authController.signUp).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PostSignUpReq('abcdefg@test.com', 'test', 'password');
            const resDto = new PostSignUpRes('test', 'testJwtToken');
            authService.signUp = jest.fn().mockResolvedValue(resDto);
            const result = await authController.signUp(reqDto);
            expect(result).toBe(resDto);
        });
    });

    describe('signIn', () => {
        it('signIn 이 정의되어 있다.', () => {
            expect(authController.signIn).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PostSignInReq('abcdefg@test.com', 'password');
            const resDto = new PostSignInRes('test', 'testJwtToken');
            authService.signIn = jest.fn().mockResolvedValue(resDto);
            const result = await authController.signIn(reqDto);
            expect(result).toBe(resDto);
        });
    });

    describe('breakOut', () => {
        it('breakOut 이 정의되어 있다.', () => {
            expect(authController.breakOut).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const deletedAt = new Date('2023-05-07 15:36:00');
            const reqDto = new PostBreakOutReq('password');
            const resDto = new PostBreakOutRes(deletedAt);
            authService.breakOut = jest.fn().mockResolvedValue(resDto);
            const result = await authController.breakOut(1, reqDto, deletedAt);
            expect(result).toBe(resDto);
        });
    });
});
