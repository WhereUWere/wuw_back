import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { PostEmailReq } from './dto/request/post.email.req';
import { PostEmailRes } from './dto/response/post.email.res';
import { PostNicknameReq } from './dto/request/post.nickname.req';
import { PostNicknameRes } from './dto/response/post.nickname.res';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { PostSignUpReq } from './dto/request/post.signup.req';
import { PostSignUpRes } from './dto/response/post.signup.res';
import { EmailExistsException, NicknameExistsException } from 'src/lib/exceptions/auth.exception';
import * as bcrypt from 'bcrypt';
import { auth } from 'src/config/authConfig';

@Injectable()
export class AuthService {
    constructor(
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

        return new PostSignUpRes(newUser);
    }

    private async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(auth.hashSalt);
        const encryptedPassword = await bcrypt.hash(password, salt);
        return encryptedPassword;
    }
}
