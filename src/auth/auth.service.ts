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
    EmailExistsException,
    EmailNotFoundException,
    NicknameNotFoundException,
    NotAuthenticatedException,
    UserNotFoundException,
} from 'src/lib/exceptions/auth.exception';
import * as bcrypt from 'bcrypt';
import { auth } from 'src/config/authConfig';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadReq } from './dto/request/jwt.payload.req';
import { PostSignInReq } from './dto/request/post.signin.req';
import { PostSignInRes } from './dto/response/post.signin.res';
import { PostBreakOutReq } from './dto/request/post.breakout.req';
import { PostBreakOutRes } from './dto/response/post.breakout.res';
import { NicknameExistsException } from 'src/lib/exceptions/profile.exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
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

        const encryptedPassword = await this.encryptPassword(req.password);

        const newUser = await this.userRepository.createAndSave(
            req.email,
            req.nickname,
            encryptedPassword,
        );

        const jwtToken = await this.createJwtToken(newUser.userId);

        return new PostSignUpRes(req.nickname, jwtToken);
    }

    async signIn(req: PostSignInReq): Promise<PostSignInRes> {
        const userExists = await this.userRepository.findUserByEmail(req.email);
        if (!userExists) throw new EmailNotFoundException();
        const isMatch = await bcrypt.compare(req.password, userExists.password);
        if (!isMatch) throw new NotAuthenticatedException();

        const profile = await this.profileRepository.findNicknameByUserId(userExists.userId);
        if (!profile) throw new NicknameNotFoundException();

        const jwtToken = await this.createJwtToken(userExists.userId);
        return new PostSignInRes(profile.nickname, jwtToken);
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

    private async createJwtToken(userId: number): Promise<string> {
        const jwtPayload = Object.assign({}, new JwtPayloadReq(userId));
        return await this.jwtService.signAsync(jwtPayload);
    }

    private async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(auth.hashSalt);
        const encryptedPassword = await bcrypt.hash(password, salt);
        return encryptedPassword;
    }
}
