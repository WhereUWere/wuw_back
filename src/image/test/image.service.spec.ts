import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from '../image.service';
import { S3Service } from 'src/s3/s3.service';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { createMock } from '@golevelup/ts-jest';
import { ProfileNotFoundException } from 'src/lib/exceptions/profile.exception';
import { GetAvatarRes } from 'src/user/dto/response/get.avatar.res';
import {
    ExcessFileMaxSizeException,
    UnsupportedMimetypeException,
} from 'src/lib/exceptions/image.exception';
import { PostAvatarRes } from 'src/user/dto/response/post.avatar.res';
import { DeleteAvatarRes } from 'src/user/dto/response/delete.avatar.res';

describe('ImageService', () => {
    let imageService: ImageService;
    let s3Service: S3Service;
    let profileRepository: ProfileRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                { provide: S3Service, useValue: createMock<S3Service>() },
                { provide: ProfileRepository, useValue: createMock<ProfileRepository>() },
            ],
        }).compile();

        imageService = module.get<ImageService>(ImageService);
        s3Service = module.get<S3Service>(S3Service);
        profileRepository = module.get<ProfileRepository>(ProfileRepository);
    });

    it('should be defined', () => {
        expect(imageService).toBeDefined();
    });

    describe('getAvatar', () => {
        it('getAvatar 가 정의되어 있다.', () => {
            expect(imageService.getAvatar).toBeDefined();
        });
        it('profile 이 존재하지 않을 경우, ProfileNotFoundException 발생', async () => {
            profileRepository.findAvatarByUserId = jest.fn().mockResolvedValue(null);
            const result = async () => await imageService.getAvatar(1);
            expect(result).rejects.toThrowError(new ProfileNotFoundException());
        });
        it('profile 에 avatar 가 존재하지 않을 경우, null 을 리턴한다.', async () => {
            profileRepository.findAvatarByUserId = jest.fn().mockResolvedValue({ avatar: null });
            const resDto = new GetAvatarRes(null);
            const result = await imageService.getAvatar(1);
            expect(result).toStrictEqual(resDto);
        });
        it('profile 의 avatar 를 Storage Url 로 변환하여 리턴한다.', async () => {
            profileRepository.findAvatarByUserId = jest
                .fn()
                .mockResolvedValue({ avatar: 'test.jpeg' });
            s3Service.createS3ObjectFullUrl = jest
                .fn()
                .mockImplementation(() => 'https://test.url');
            const resDto = new GetAvatarRes('https://test.url');
            const result = await imageService.getAvatar(1);
            expect(s3Service.createS3ObjectFullUrl).toBeCalledTimes(1);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('uploadAvatar', () => {
        it('uploadAvatar 가 정의되어 있다.', () => {
            expect(imageService.uploadAvatar).toBeDefined();
        });
        it('file 의 mimetype 이 image/ 로 시작하지 않을 경우, UnsupportedMimetypeException 발생', async () => {
            const image = {
                mimetype: 'application/pdf',
            } as Express.Multer.File;
            const result = async () => await imageService.uploadAvatar(1, image);
            expect(result).rejects.toThrowError(new UnsupportedMimetypeException());
        });
        it('file 의 size 가 5MB 를 초과할 경우, ExcessFileMaxSizeException 발생', async () => {
            const image = {
                mimetype: 'image/jpeg',
                size: 1024 * 1024 * 6,
            } as Express.Multer.File;
            const result = async () => await imageService.uploadAvatar(1, image);
            expect(result).rejects.toThrowError(new ExcessFileMaxSizeException());
        });
        it('업로드된 file 의 path 를 리턴한다.', async () => {
            const image = {
                mimetype: 'image/jpeg',
                size: 1024 * 1024 * 4,
            } as Express.Multer.File;
            profileRepository.doesUserHaveAvatar = jest.fn().mockImplementation(() => false);
            const resDto = new PostAvatarRes('origin/1/avatar.jpeg');
            const result = await imageService.uploadAvatar(1, image);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('deleteAvatar', () => {
        it('deleteAvatar 가 정의되어 있다.', () => {
            expect(imageService.deleteAvatar).toBeDefined();
        });
        it('삭제한 file 의 path 를 리턴한다.', async () => {
            const resDto = new DeleteAvatarRes('origin/1/avatar.jpeg');
            const result = await imageService.deleteAvatar(1);
            expect(result).toStrictEqual(resDto);
        });
    });
});
