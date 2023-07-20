import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from 'src/user/repository/user.repository';
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
    JwtInvalidTokenException,
    JwtRefreshTokenExpiredException,
    JwtRefreshTokenInvalidSignatureException,
    JwtRefreshTokenNotFoundException,
    JwtUserNotFoundException,
    KakaoEmailNotFoundException,
    NotAuthenticatedException,
    UserNotFoundException,
    UserRefreshTokenNotFoundException,
} from 'src/lib/exceptions/auth.exception';
import { PostSignUpRes } from '../dto/response/post.signup.res';
import { Profile as ProfileModel, Role, User as UserModel } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PostSignInReq } from '../dto/request/post.signin.req';
import { PostSignInRes } from '../dto/response/post.signin.res';
import * as bcrypt from 'bcrypt';
import { auth } from 'src/config/authConfig';
import { PostBreakOutReq } from '../dto/request/post.breakout.req';
import { PostBreakOutRes } from '../dto/response/post.breakout.res';
import {
    NicknameExistsException,
    NicknameNotFoundException,
} from 'src/lib/exceptions/profile.exception';
import { HttpService } from '@nestjs/axios';
import { PostSignInKakaoReq } from '../dto/request/post.signin-kakao.req';
import { PostSignInKakaoRes } from '../dto/response/post.signin-kakao.res';
import { PostSignOutRes } from '../dto/response/post.signout.res';
import { PostAccessTokenRes } from '../dto/response/post.access-token.res';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: UserRepository;
    let profileRepository: ProfileRepository;
    let jwtService: JwtService;

    const encryptedPassword = bcrypt.hashSync('password', auth.hashSalt);
    const mockedUser: UserModel = {
        userId: 1,
        email: 'abcdefg@test.com',
        password: encryptedPassword,
        role: Role.USER,
        registeredAt: new Date('2023-05-07 03:33:00'),
        updatedAt: new Date('2023-05-07 03:33:00'),
        deletedAt: null,
        refreshToken: 'testRefreshToken',
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
                { provide: HttpService, useValue: createMock<HttpService> },
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
        it('signUp 이 성공하면, nickname 과 accessToken 을 리턴한다.', async () => {
            const testToken = await jwtService.signAsync({ userId: mockedUser.userId });
            const reqDto = new PostSignUpReq('abcdefg@test.com', 'test', 'password');
            const resDto = new PostSignUpRes('test', testToken, testToken);
            jwtService.signAsync = jest.fn().mockImplementation(() => testToken);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            profileRepository.findUserIdByNickname = jest.fn().mockResolvedValue(null);
            userRepository.createAndSave = jest.fn().mockResolvedValue(mockedUser);
            userRepository.setEncryptedRefreshToken = jest.fn();
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
        it('signIn 이 성공하면, nickname 과 accessToken 을 리턴한다.', async () => {
            const testToken = await jwtService.signAsync({ userId: mockedUser.userId });
            const reqDto = new PostSignInReq('abcdefg@test.com', 'password');
            const resDto = new PostSignInRes('test', testToken, testToken);
            jwtService.signAsync = jest.fn().mockImplementation(() => testToken);
            userRepository.findUserByEmail = jest.fn().mockResolvedValue(mockedUser);
            profileRepository.findNicknameByUserId = jest
                .fn()
                .mockResolvedValue({ nickname: 'test' });
            userRepository.setEncryptedRefreshToken = jest.fn();
            const result = await authService.signIn(reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('signInWithKakao', () => {
        let getUserEmailByKakaoMock: any;

        beforeEach(() => {
            getUserEmailByKakaoMock = jest.spyOn(
                AuthService.prototype as any,
                'getUserEmailByKakao',
            );
        });

        it('signInWithKakao 가 정의되어 있다.', () => {
            expect(authService.signInWithKakao).toBeDefined();
        });
        it('카카오에 등록된 회원 이메일이 없을 경우, KakaoEmailNotFoundException 발생', async () => {
            getUserEmailByKakaoMock.mockImplementation(() => undefined);
            const reqDto = new PostSignInKakaoReq('testAccessToken');
            const result = async () => await authService.signInWithKakao(reqDto);
            await expect(result).rejects.toThrowError(new KakaoEmailNotFoundException());
        });
        it('카카오에 등록된 회원 이메일로 가입하지 않은 유저일 경우, 가입 여부와 이메일을 리턴한다.', async () => {
            getUserEmailByKakaoMock.mockImplementation(() => 'test@kakao.com');
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            const reqDto = new PostSignInKakaoReq('testAccessToken');
            const resDto = new PostSignInKakaoRes(false, 'test@kakao.com');
            const result = await authService.signInWithKakao(reqDto);
            expect(result).toStrictEqual(resDto);
        });
        it('카카오에 등록된 회원 이메일로 가입한 유저일 경우, 가입 여부와 이메일, accessToken 을 리턴한다.', async () => {
            const accessToken = await jwtService.signAsync({ userId: 1 });
            const reqDto = new PostSignInKakaoReq('testAccessToken');
            const resDto = new PostSignInKakaoRes(true, 'test@kakao.com', accessToken);
            getUserEmailByKakaoMock.mockImplementation(() => 'test@kakao.com');
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue({ userId: 1 });
            jwtService.signAsync = jest.fn().mockImplementationOnce(() => accessToken);
            const result = await authService.signInWithKakao(reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('signOut', () => {
        it('signOut 이 정의되어 있다.', () => {
            expect(authService.signOut).toBeDefined();
        });
        it('signOut 에 실패할 경우, fail 을 리턴한다.', async () => {
            const resDto = new PostSignOutRes('fail');
            userRepository.clearRefreshToken = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = async () => await authService.signOut(1);
            await expect(result()).resolves.toStrictEqual(resDto);
        });
        it('signOut 에 성공할 경우, success 를 리턴한다.', async () => {
            const resDto = new PostSignOutRes('success');
            userRepository.clearRefreshToken = jest.fn();
            const result = await authService.signOut(1);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('getAccessTokenWithRefreshToken', () => {
        it('getAccessTokenWithRefreshToken 이 정의되어 있다.', () => {
            expect(authService.getAccessTokenWithRefreshToken).toBeDefined();
        });
        it('Cookie 에 refreshToken 이 존재하지 않을 경우, JwtRefreshTokenNotFoundException 발생', async () => {
            const result = async () => await authService.getAccessTokenWithRefreshToken(undefined);
            await expect(result).rejects.toThrowError(new JwtRefreshTokenNotFoundException());
        });
        it('refreshToken 이 만료된 경우, JwtRefreshTokenExpiredException 발생', async () => {
            jwtService.verifyAsync = jest.fn().mockImplementation(() => {
                throw new Error('jwt expired');
            });
            const result = async () =>
                await authService.getAccessTokenWithRefreshToken('testRefreshToken');
            await expect(result).rejects.toThrowError(new JwtRefreshTokenExpiredException());
        });
        it('refreshToken 의 secret 값이 다른 경우, JwtRefreshTokenInvalidSignatureException 발생', async () => {
            jwtService.verifyAsync = jest.fn().mockImplementation(() => {
                throw new Error('invalid signature');
            });
            const result = async () =>
                await authService.getAccessTokenWithRefreshToken('testRefreshToken');
            await expect(result).rejects.toThrowError(
                new JwtRefreshTokenInvalidSignatureException(),
            );
        });
        it('refreshToken 에 userId 가 존재하지 않는 경우, JwtInvalidTokenException 발생', async () => {
            jwtService.verifyAsync = jest.fn().mockImplementation(() => ({ fake_id: 1 }));
            const result = async () =>
                await authService.getAccessTokenWithRefreshToken('testRefreshToken');
            await expect(result).rejects.toThrowError(new JwtInvalidTokenException());
        });
        it('userId 에 해당하는 유저가 존재하지 않는 경우, JwtUserNotFoundException 발생', async () => {
            jwtService.verifyAsync = jest.fn().mockImplementation(() => ({ userId: 1 }));
            userRepository.findUserByUserId = jest.fn().mockImplementation(() => null);
            const result = async () =>
                await authService.getAccessTokenWithRefreshToken('testRefreshToken');
            await expect(result).rejects.toThrowError(new JwtUserNotFoundException());
        });
        it('유저의 refreshToken 이 존재하지 않는 경우, UserRefreshTokenNotFoundException 발생', async () => {
            const userWithoutRefreshToken: UserModel = {
                userId: 1,
                email: 'abcdefg@test.com',
                password: encryptedPassword,
                role: Role.USER,
                registeredAt: new Date('2023-05-07 03:33:00'),
                updatedAt: new Date('2023-05-07 03:33:00'),
                deletedAt: null,
                refreshToken: null,
            };
            jwtService.verifyAsync = jest.fn().mockImplementation(() => ({ userId: 1 }));
            userRepository.findUserByUserId = jest
                .fn()
                .mockImplementation(() => userWithoutRefreshToken);
            const result = async () =>
                await authService.getAccessTokenWithRefreshToken('testRefreshToken');
            await expect(result).rejects.toThrowError(new UserRefreshTokenNotFoundException());
        });
        it('유저의 refreshToken 과 일치하지 않는 경우, NotAuthenticatedException 발생', async () => {
            jwtService.verifyAsync = jest.fn().mockImplementation(() => ({ userId: 1 }));
            userRepository.findUserByUserId = jest.fn().mockImplementation(() => mockedUser);
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
            const result = async () =>
                await authService.getAccessTokenWithRefreshToken('testRefreshToken');
            await expect(result).rejects.toThrowError(new NotAuthenticatedException());
        });
        it('유저의 refreshToken 과 일치하는 경우, accessToken 을 생성해 리턴한다.', async () => {
            const testAccessToken = 'testAccessToken';
            const resDto = new PostAccessTokenRes(testAccessToken);
            jwtService.verifyAsync = jest.fn().mockImplementation(() => ({ userId: 1 }));
            userRepository.findUserByUserId = jest.fn().mockImplementation(() => mockedUser);
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);
            jwtService.signAsync = jest.fn().mockImplementation(() => testAccessToken);
            const result = await authService.getAccessTokenWithRefreshToken('testRefreshToken');
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('breakOut', () => {
        it('breakOut 이 정의되어 있다.', () => {
            expect(authService.breakOut).toBeDefined();
        });
        it('user 가 존재하지 않을 경우, UserNotFoundException 발생', async () => {
            const deletedAt = new Date('2023-05-07 15:36:00');
            const reqDto = new PostBreakOutReq('password');
            userRepository.findUserByUserId = jest.fn().mockResolvedValue(null);
            const result = async () => await authService.breakOut(1, reqDto, deletedAt);
            await expect(result).rejects.toThrowError(new UserNotFoundException());
        });
        it('password 가 일치하지 않을 경우, NotAuthenticatedException 발생', async () => {
            const deletedAt = new Date('2023-05-07 15:36:00');
            const reqDto = new PostBreakOutReq('wrongPassword');
            userRepository.findUserByUserId = jest.fn().mockResolvedValue(mockedUser);
            const result = async () => await authService.breakOut(1, reqDto, deletedAt);
            await expect(result).rejects.toThrowError(new NotAuthenticatedException());
        });
        it('breakOut 이 성공하면, 탈퇴 날짜를 리턴한다.', async () => {
            const deletedAt = new Date('2023-05-07 15:36:00');
            const deletedUser = {} as UserModel;
            const deletedProfile = {} as ProfileModel;
            const reqDto = new PostBreakOutReq('password');
            const resDto = new PostBreakOutRes(deletedAt);
            userRepository.findUserByUserId = jest.fn().mockResolvedValue(mockedUser);
            userRepository.softDelete = jest.fn().mockResolvedValue(deletedUser);
            profileRepository.softDelete = jest.fn().mockResolvedValue(deletedProfile);
            const result = await authService.breakOut(1, reqDto, deletedAt);
            expect(result).toStrictEqual(resDto);
        });
    });
});
