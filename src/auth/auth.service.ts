import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { PostEmailReq } from './dto/request/post.email.req';
import { PostEmailRes } from './dto/response/post.email.res';
import { PostNicknameReq } from './dto/request/post.nickname.req';
import { PostNicknameRes } from './dto/response/post.nickname.res';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { PostSignUpReq } from './dto/request/post.signup.req';
import { PostSignUpRes } from './dto/response/post.signup.res';
import {
    CreateAccessTokenConflictException,
    CreateRefreshTokenConflictException,
    EmailExistsException,
    EmailNotFoundException,
    JwtAccessTokenExpiredException,
    JwtAccessTokenInvalidSignatureException,
    JwtInvalidTokenException,
    JwtRefreshTokenExpiredException,
    JwtRefreshTokenInvalidSignatureException,
    JwtRefreshTokenNotFoundException,
    JwtUserNotFoundException,
    KakaoAuthConflictException,
    KakaoEmailNotFoundException,
    NotAuthenticatedException,
    UserNotFoundException,
    UserRefreshTokenNotFoundException,
} from 'src/lib/exceptions/auth.exception';
import * as bcrypt from 'bcrypt';
import { auth } from 'src/config/authConfig';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadReq } from './dto/request/jwt.payload.req';
import { PostSignInReq } from './dto/request/post.signin.req';
import { PostSignInRes } from './dto/response/post.signin.res';
import { PostBreakOutReq } from './dto/request/post.breakout.req';
import { PostBreakOutRes } from './dto/response/post.breakout.res';
import {
    NicknameExistsException,
    NicknameNotFoundException,
} from 'src/lib/exceptions/profile.exception';
import { PostSignInKakaoReq } from './dto/request/post.signin-kakao.req';
import { PostSignInKakaoRes } from './dto/response/post.signin-kakao.res';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IReadKakaoEmail } from './interface/read.kakao-email.interface';
import { User as UserModel } from '@prisma/client';
import { PostSignOutRes } from './dto/response/post.signout.res';
import { PostAccessTokenRes } from './dto/response/post.access-token.res';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
        private readonly userRepository: UserRepository,
        private readonly profileRepository: ProfileRepository,
    ) {}

    async checkDuplicateEmail(req: PostEmailReq): Promise<PostEmailRes> {
        const userId = await this.userRepository.findUserIdByEmail(req.email);
        return new PostEmailRes(userId ? true : false);
    }

    async checkDuplicateNickname(req: PostNicknameReq): Promise<PostNicknameRes> {
        const userId = await this.profileRepository.findUserIdByNickname(req.nickname);
        return new PostNicknameRes(userId ? true : false);
    }

    async signUp(req: PostSignUpReq): Promise<PostSignUpRes> {
        const emailExists = await this.userRepository.findUserIdByEmail(req.email);
        if (emailExists) throw new EmailExistsException();
        const nicknameExists = await this.profileRepository.findUserIdByNickname(req.nickname);
        if (nicknameExists) throw new NicknameExistsException();

        const encryptedPassword = await this.encryptString(req.password);

        const newUser = await this.userRepository.createAndSave(
            req.email,
            req.nickname,
            encryptedPassword,
        );

        const accessToken = await this.createAccessToken(newUser);
        const refreshToken = await this.createRefreshToken(newUser);
        const encryptedRefreshToken = await this.encryptString(refreshToken);

        await this.userRepository.setEncryptedRefreshToken(newUser.userId, encryptedRefreshToken);

        return new PostSignUpRes(req.nickname, accessToken, refreshToken);
    }

    async signIn(req: PostSignInReq): Promise<PostSignInRes> {
        const userExists = await this.userRepository.findUserByEmail(req.email);
        if (!userExists) throw new EmailNotFoundException();
        const isMatch = await bcrypt.compare(req.password, userExists.password);
        if (!isMatch) throw new NotAuthenticatedException();

        const profile = await this.profileRepository.findNicknameByUserId(userExists.userId);
        if (!profile) throw new NicknameNotFoundException();

        const accessToken = await this.createAccessToken(userExists);
        const refreshToken = await this.createRefreshToken(userExists);

        const encryptedRefreshToken = await this.encryptString(refreshToken);

        await this.userRepository.setEncryptedRefreshToken(
            userExists.userId,
            encryptedRefreshToken,
        );

        return new PostSignInRes(profile.nickname, accessToken, refreshToken);
    }

    async signInWithKakao(req: PostSignInKakaoReq): Promise<PostSignInKakaoRes> {
        const userEmail = await this.getUserEmailByKakao(req.kakaoAccessToken);
        if (!userEmail) throw new KakaoEmailNotFoundException();

        const userExists = await this.userRepository.findUserIdByEmail(userEmail);
        if (!userExists) return new PostSignInKakaoRes(false, userEmail);

        const accessToken = await this.createAccessToken(userExists);
        return new PostSignInKakaoRes(true, userEmail, accessToken);
    }

    async signOut(userId: number): Promise<PostSignOutRes> {
        try {
            await this.userRepository.clearRefreshToken(userId);
            return new PostSignOutRes('success');
        } catch (error) {
            return new PostSignOutRes('fail');
        }
    }

    async getAccessTokenWithRefreshToken(refreshToken?: string): Promise<PostAccessTokenRes> {
        if (!refreshToken) throw new JwtRefreshTokenNotFoundException();

        const decodedObj = await this.verifyRefreshToken(refreshToken);
        const userId = decodedObj?.['userId'];
        if (!userId) throw new JwtInvalidTokenException();

        const userModel = await this.userRepository.findUserByUserId(userId);
        if (!userModel) throw new JwtUserNotFoundException();

        const encryptedRefreshToken = userModel?.refreshToken;
        if (!encryptedRefreshToken) throw new UserRefreshTokenNotFoundException();

        const isMatch = await bcrypt.compare(refreshToken, encryptedRefreshToken);
        if (!isMatch) throw new NotAuthenticatedException();

        const accessToken = await this.createAccessToken(userModel);
        return new PostAccessTokenRes(accessToken);
    }

    /**
     * @todo Prisma soft delete middleware 적용
     * @legacy soft delete 로 수정될 예정
     */
    async breakOut(userId: number, req: PostBreakOutReq, date: Date): Promise<PostBreakOutRes> {
        const userExists = await this.userRepository.findUserByUserId(userId);
        if (!userExists) throw new UserNotFoundException();
        const isMatch = await bcrypt.compare(req.password, userExists.password);
        if (!isMatch) throw new NotAuthenticatedException();

        await this.userRepository.hardDelete(userId);

        return new PostBreakOutRes(date);
    }

    async verifyAccessToken(accessToken: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(accessToken, { secret: auth.jwtAccessSecret });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'jwt expired') throw new JwtAccessTokenExpiredException();
                if (error.message === 'invalid signature')
                    throw new JwtAccessTokenInvalidSignatureException();
            }
        }
    }

    private async verifyRefreshToken(refreshToken: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(refreshToken, {
                secret: auth.jwtRefreshSecret,
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'jwt expired') throw new JwtRefreshTokenExpiredException();
                if (error.message === 'invalid signature')
                    throw new JwtRefreshTokenInvalidSignatureException();
            }
        }
    }

    private async createAccessToken(user: Pick<UserModel, 'userId'>): Promise<string> {
        try {
            const jwtPayload = Object.assign({}, new JwtPayloadReq(user.userId));
            return await this.jwtService.signAsync(jwtPayload, {
                secret: auth.jwtAccessSecret,
                expiresIn: auth.jwtAccessExpireTime,
            });
        } catch (error) {
            throw new CreateAccessTokenConflictException();
        }
    }

    private async createRefreshToken(user: Pick<UserModel, 'userId'>): Promise<string> {
        try {
            const jwtPayload = Object.assign({}, new JwtPayloadReq(user.userId));
            return await this.jwtService.signAsync(jwtPayload, {
                secret: auth.jwtRefreshSecret,
                expiresIn: auth.jwtRefreshExpireTime,
            });
        } catch (error) {
            throw new CreateRefreshTokenConflictException();
        }
    }

    private async encryptString(target: string): Promise<string> {
        const salt = await bcrypt.genSalt(auth.hashSalt);
        const encryptedString = await bcrypt.hash(target, salt);
        return encryptedString;
    }

    private async getUserEmailByKakao(kakaoAccessToken: string): Promise<string | undefined> {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get<IReadKakaoEmail>(auth.kakaoServerUrl, {
                    headers: {
                        Authorization: `Bearer ${kakaoAccessToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    params: {
                        secure_resource: true,
                        property_keys: ['kakao_account.email'],
                    },
                }),
            );

            return data.email;
        } catch (error) {
            throw new KakaoAuthConflictException();
        }
    }
}
