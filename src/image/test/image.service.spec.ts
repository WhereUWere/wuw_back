import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from '../image.service';
import { S3Service } from 'src/s3/s3.service';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { createMock } from '@golevelup/ts-jest';

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
});
