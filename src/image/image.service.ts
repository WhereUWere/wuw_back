import { Injectable } from '@nestjs/common';
import { aws } from 'src/config/awsConfig';
import { file as fileConfig } from 'src/config/fileConfig';
import {
    ExcessFileMaxSizeException,
    UnsupportedMimetypeException,
} from 'src/lib/exceptions/image.exception';
import { ProfileNotFoundException } from 'src/lib/exceptions/profile.exception';
import { S3Service } from 'src/s3/s3.service';
import { DeleteAvatarRes } from 'src/user/dto/response/delete.avatar.res';
import { GetAvatarRes } from 'src/user/dto/response/get.avatar.res';
import { PostAvatarRes } from 'src/user/dto/response/post.avatar.res';
import { ProfileRepository } from 'src/user/repository/profile.repository';

@Injectable()
export class ImageService {
    constructor(
        private readonly s3Service: S3Service,
        private readonly profileRepository: ProfileRepository,
    ) {}

    async getAvatar(userId: number): Promise<GetAvatarRes> {
        const profile = await this.profileRepository.findAvatarByUserId(userId);
        if (!profile) throw new ProfileNotFoundException();

        return new GetAvatarRes(
            profile.avatar
                ? this.s3Service.createS3ObjectFullUrl(aws.awsAvatarS3Bucket, profile.avatar)
                : null,
        );
    }

    async uploadAvatar(userId: number, file: Express.Multer.File): Promise<PostAvatarRes> {
        if (!file.mimetype.startsWith('image/')) throw new UnsupportedMimetypeException();
        if (file.size >= fileConfig.avatarFileMaxSize) throw new ExcessFileMaxSizeException();

        const avatarExist = await this.profileRepository.doesUserHaveAvatar(userId);
        if (avatarExist) await this.s3Service.clearDirectory(`${userId}/`, aws.awsAvatarS3Bucket);

        const key = this.createAvatarKey(userId);

        await this.s3Service.putObject(file, key, aws.awsAvatarS3Bucket);
        await this.profileRepository.updateAvatarByUserId(userId, key);

        return new PostAvatarRes(key);
    }

    async deleteAvatar(userId: number): Promise<DeleteAvatarRes> {
        await this.s3Service.clearDirectory(`${userId}/`, aws.awsAvatarS3Bucket);
        await this.profileRepository.deleteAvatarByUserId(userId);

        const key = this.createAvatarKey(userId);

        return new DeleteAvatarRes(key);
    }

    private createAvatarKey(userId: number): string {
        return `${userId}/avatar.jpeg`;
    }
}
