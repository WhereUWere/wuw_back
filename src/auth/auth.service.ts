import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { PostEmailReq } from './dto/request/post.email.req';
import { PostEmailRes } from './dto/response/post.email.res';
import { PostNicknameReq } from './dto/request/post.nickname.req';
import { PostNicknameRes } from './dto/response/post.nickname.res';
import { ProfileRepository } from 'src/user/repository/profile.repository';

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
}
