import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
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
import { PostSignInKakaoReq } from '../dto/request/post.signin-kakao.req';
import { PostSignInKakaoRes } from '../dto/response/post.signin-kakao.res';
import { Response } from 'express';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: createMock<AuthService>() }],
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
            const resDto = new PostSignUpRes('test', 'testAccessToken', 'testRefreshToken');
            const res = {} as Response;
            res.cookie = jest.fn();
            authService.signUp = jest.fn().mockResolvedValue(resDto);
            const result = await authController.signUp(reqDto, res);
            expect(result).toBe(resDto);
        });
    });

    describe('signIn', () => {
        it('signIn 이 정의되어 있다.', () => {
            expect(authController.signIn).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PostSignInReq('abcdefg@test.com', 'password');
            const resDto = new PostSignInRes('test', 'testAccessToken', 'testRefreshToken');
            const res = {} as Response;
            res.cookie = jest.fn();
            authService.signIn = jest.fn().mockResolvedValue(resDto);
            const result = await authController.signIn(reqDto, res);
            expect(result).toBe(resDto);
        });
    });

    describe('signInWithKakao', () => {
        it('signInWithKakao 가 정의되어 있다.', () => {
            expect(authController.signInWithKakao).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PostSignInKakaoReq('testKakaoAccessToken');
            const resDto = new PostSignInKakaoRes(true, 'test@test.com', 'testAccessToken');
            authService.signInWithKakao = jest.fn().mockResolvedValue(resDto);
            const result = await authController.signInWithKakao(reqDto);
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
