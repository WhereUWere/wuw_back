import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { ProfileRepository } from './repository/profile.repository';
import { GetProfileRes } from './dto/response/get.profile.res';
import { PatchProfileReq } from './dto/request/patch.profile.req';
import { PatchProfileRes } from './dto/response/patch.profile.res';
import { ProfileNotFoundException } from 'src/lib/exceptions/profile.exception';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly profileRepository: ProfileRepository,
    ) {}

    async getProfile(userId: number): Promise<GetProfileRes> {
        const profile = await this.profileRepository.findOneByUserId(userId);
        if (!profile) throw new ProfileNotFoundException();

        return new GetProfileRes(
            profile.nickname,
            profile.phoneNumber,
            profile.birthOfDate,
            profile.bio,
        );
    }

    async updateProfile(userId: number, req: PatchProfileReq): Promise<PatchProfileRes> {
        const profile = await this.profileRepository.findNicknameByUserId(userId);
        if (!profile) throw new ProfileNotFoundException();

        const data = {
            nickname: req.nickname,
            phoneNumber: req.phoneNumber,
            birthOfDate: req.birthOfDate,
            bio: req.bio,
        };
        const newProfile = await this.profileRepository.updateProfileByUserId(userId, data);

        return new PatchProfileRes(
            newProfile.nickname,
            newProfile.phoneNumber,
            newProfile.birthOfDate,
            newProfile.bio,
        );
    }
}
