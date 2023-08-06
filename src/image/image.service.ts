import { Injectable } from '@nestjs/common';
import { aws } from 'src/config/awsConfig';
import { S3Service } from 'src/s3/s3.service';
import { PostAvatarRes } from 'src/user/dto/response/post.avatar.res';
import { ProfileRepository } from 'src/user/repository/profile.repository';

@Injectable()
export class ImageService {
    constructor(
        private readonly s3Service: S3Service,
        private readonly profileRepository: ProfileRepository,
    ) {}

    async uploadAvatar(userId: number, file: Express.Multer.File): Promise<PostAvatarRes> {
        const avatarExist = await this.profileRepository.doesUserHaveAvatar(userId);
        if (avatarExist) {
            await this.s3Service.clearDirectory(`${userId}/`, aws.awsAvatarS3Bucket);
            await this.profileRepository.deleteAvatarByUserId(userId);
        }

        const key = this.makeAvatarKey(userId);

        await this.s3Service.putObject(file, key, aws.awsAvatarS3Bucket);
        await this.profileRepository.updateAvatarByUserId(userId, key);

        return new PostAvatarRes(key);
    }

    private makeAvatarKey(userId: number): string {
        return `${userId}/avatar.jpeg`;
    }
}
