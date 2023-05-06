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
import {
    EmailExistsException,
    EmailNotFoundException,
    NicknameExistsException,
    NicknameNotFoundException,
    NotAuthenticatedException,
} from 'src/lib/exceptions/auth.exception';
import { PostSignUpRes } from '../dto/response/post.signup.res';
import { Role } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PostSignInReq } from '../dto/request/post.signin.req';
import { PostSignInRes } from '../dto/response/post.signin.res';
import * as bcrypt from 'bcrypt';
import { auth } from 'src/config/authConfig';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: UserRepository;
    let profileRepository: ProfileRepository;
    let jwtService: JwtService;

    const encryptedPassword = bcrypt.hashSync('password', auth.hashSalt);
    const mockedUser = {
        userId: 1,
        email: 'abcdefg@test.com',
        nickname: 'test',
        password: encryptedPassword,
        role: Role.USER,
        registeredAt: new Date('2023-05-07 03:33:00'),
        updatedAt: new Date('2023-05-07 03:33:00'),
        deletedAt: null,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'testSecret',
                    signOptions: { expiresIn: '60s' },
                }),
            ],
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
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('checkDuplicateEmail', () => {
        it('checkDuplicateEmail 이 정의되어 있다.', () => {
            expect(authService.checkDuplicateEmail).toBeDefined();
        });
        it('이메일이 존재할 경우, true 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@test.com');
            const resDto = new PostEmailRes(true);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue({ userId: 1 });
            const result = await authService.checkDuplicateEmail(reqDto);
            expect(result).toStrictEqual(resDto);
        });
        it('이메일이 존재하지 않을 경우, false 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@test.com');
            const resDto = new PostEmailRes(false);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            const result = await authService.checkDuplicateEmail(reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('checkDuplicateNickname', () => {
        it('checkDuplicateNickname 이 정의되어 있다.', () => {
            expect(authService.checkDuplicateNickname).toBeDefined();
        });
        it('닉네임이 존재할 경우, true 를 리턴한다.', async () => {
            const reqDto = new PostNicknameReq('test');
            const resDto = new PostNicknameRes(true);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue({ userId: 1 });
            const result = await authService.checkDuplicateNickname(reqDto);
            expect(result).toStrictEqual(resDto);
        });
        it('닉네임이 존재하지 않을 경우, false 를 리턴한다.', async () => {
            const reqDto = new PostNicknameReq('test');
            const resDto = new PostNicknameRes(false);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue(null);
            const result = await authService.checkDuplicateNickname(reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('signUp', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('signUp 이 정의되어 있다.', () => {
            expect(authService.signUp).toBeDefined();
        });
        it('가입된 email 이 존재할 경우, EmailExistsException 발생', async () => {
            const reqDto = new PostSignUpReq('abcdefg@test.com', 'test', 'password');
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue({ userId: 1 });
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue(null);
            const result = async () => await authService.signUp(reqDto);
            await expect(result).rejects.toThrowError(new EmailExistsException());
        });
        it('가입된 nickname 이 존재할 경우, NicknameExistsException 발생', async () => {
            const reqDto = new PostSignUpReq('abcdefg@test.com', 'test', 'password');
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue({ userId: 1 });
            const result = async () => await authService.signUp(reqDto);
            await expect(result).rejects.toThrowError(new NicknameExistsException());
        });
        it('signUp 이 성공하면, nickname 과 jwtToken 을 리턴한다.', async () => {
            const jwtToken = await jwtService.signAsync({ userId: mockedUser.userId });
            const reqDto = new PostSignUpReq('abcdefg@test.com', 'test', 'password');
            const resDto = new PostSignUpRes('test', jwtToken);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue(null);
            userRepository.createAndSave = jest.fn().mockResolvedValue(mockedUser);
            const result = await authService.signUp(reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('signIn', () => {
        it('signIn 이 정의되어 있다.', () => {
            expect(authService.signIn).toBeDefined();
        });
        it('가입된 email 이 존재하지 않을 경우, EmailNotFoundException 발생', async () => {
            const reqDto = new PostSignInReq('abcdefg@test.com', 'password');
            userRepository.findUserByEmail = jest.fn().mockResolvedValue(null);
            const result = async () => await authService.signIn(reqDto);
            await expect(result).rejects.toThrowError(new EmailNotFoundException());
        });
        it('패스워드가 일치하지 않을 경우, NotAuthenticatedException 발생', async () => {
            const reqDto = new PostSignInReq('abcdefg@test.com', 'wrongPassword');
            userRepository.findUserByEmail = jest.fn().mockResolvedValue(mockedUser);
            const result = async () => await authService.signIn(reqDto);
            await expect(result).rejects.toThrowError(new NotAuthenticatedException());
        });
        it('nickname 이 존재하지 않을 경우, NicknameNotFoundException 발생', async () => {
            const reqDto = new PostSignInReq('abcdefg@test.com', 'password');
            userRepository.findUserByEmail = jest.fn().mockResolvedValue(mockedUser);
            profileRepository.findNicknameByUserId = jest.fn().mockResolvedValue(null);
            const result = async () => await authService.signIn(reqDto);
            await expect(result).rejects.toThrowError(new NicknameNotFoundException());
        });
        it('signIn 이 성공하면, nickname 과 jwtToken 을 리턴한다.', async () => {
            const jwtToken = await jwtService.signAsync({ userId: mockedUser.userId });
            const reqDto = new PostSignInReq('abcdefg@test.com', 'password');
            const resDto = new PostSignInRes(mockedUser.nickname, jwtToken);
            userRepository.findUserByEmail = jest.fn().mockResolvedValue(mockedUser);
            profileRepository.findNicknameByUserId = jest
                .fn()
                .mockResolvedValue({ nickname: mockedUser.nickname });
            const result = await authService.signIn(reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });
});
