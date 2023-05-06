import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { PostEmailReq } from '../dto/request/post.email.req';
import { PostEmailRes } from '../dto/response/post.email.res';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { PostNicknameReq } from '../dto/request/post.nickname.req';
import { PostNicknameRes } from '../dto/response/post.nickname.res';
import { PostSignUpReq } from '../dto/request/post.signup.req';
import { EmailExistsException, NicknameExistsException } from 'src/lib/exceptions/auth.exception';
import { PostSignUpRes } from '../dto/response/post.signup.res';
import { Role } from '@prisma/client';
import { now } from 'src/lib/utils/dates/date.utils';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: UserRepository;
    let profileRepository: ProfileRepository;
    const email = 'abcdefg@test.com';
    const nickname = 'test';
    const password = 'password';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserRepository, useValue: createMock<UserRepository>() },
                { provide: ProfileRepository, useValue: createMock<ProfileRepository>() },
                { provide: PrismaService, useValue: createMock<PrismaService>() },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepository>(UserRepository);
        profileRepository = module.get<ProfileRepository>(ProfileRepository);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('checkDuplicateEmail', () => {
        it('checkDuplicateEmail 이 정의되어 있다.', () => {
            expect(authService.checkDuplicateEmail).toBeDefined();
        });
        it('이메일이 존재할 경우, true 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq(email);
            const resDto = new PostEmailRes(true);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue({ userId: 1 });
            const result = await authService.checkDuplicateEmail(reqDto);
            expect(result.isDuplicated).toBe(true);
            expect(result).toStrictEqual(resDto);
        });
        it('이메일이 존재하지 않을 경우, false 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq(email);
            const resDto = new PostEmailRes(false);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            const result = await authService.checkDuplicateEmail(reqDto);
            expect(result.isDuplicated).toBe(false);
            expect(result).toStrictEqual(resDto);
        });
    });
    describe('checkDuplicateNickname', () => {
        it('checkDuplicateNickname 이 정의되어 있다.', () => {
            expect(authService.checkDuplicateNickname).toBeDefined();
        });
        it('닉네임이 존재할 경우, true 를 리턴한다.', async () => {
            const reqDto = new PostNicknameReq(nickname);
            const resDto = new PostNicknameRes(true);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue({ userId: 1 });
            const result = await authService.checkDuplicateNickname(reqDto);
            expect(result.isDuplicated).toBe(true);
            expect(result).toStrictEqual(resDto);
        });
        it('닉네임이 존재하지 않을 경우, false 를 리턴한다.', async () => {
            const reqDto = new PostNicknameReq(nickname);
            const resDto = new PostNicknameRes(false);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue(null);
            const result = await authService.checkDuplicateNickname(reqDto);
            expect(result.isDuplicated).toBe(false);
            expect(result).toStrictEqual(resDto);
        });
    });
    describe('signUp', () => {
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
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('signUp 이 정의되어 있다.', () => {
            expect(AuthService.signUp).toBeDefined();
        });
        it('가입된 email 이 존재할 경우, EmailExistsException 발생', async () => {
            const reqDto = new PostSignUpReq(email, nickname, password);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue({ userId: 1 });
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue(null);
            const result = async () => await authService.signUp(reqDto);
            await expect(result).rejects.toThrowError(new EmailExistsException());
        });
        it('가입된 nickname 이 존재할 경우, NicknameExistsException 발생', async () => {
            const reqDto = new PostSignUpReq(email, nickname, password);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue({ userId: 1 });
            const result = async () => await authService.signUp(reqDto);
            await expect(result).rejects.toThrowError(new NicknameExistsException());
        });
        it('signUp 이 성공하면, 가입된 user 를 리턴한다.', async () => {
            const reqDto = new PostSignUpReq(email, nickname, password);
            const resDto = new PostSignUpRes(mockedUser);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue(null);
            userRepository.createAndSave = jest.fn().mockResolvedValue(mockedUser);
            const result = await authService.signUp(reqDto);
            expect(result).toStrictEqual(resDto);
            expect(result.email).toBe(email);
            expect(result.nickname).toBe(nickname);
        });
    });
});
