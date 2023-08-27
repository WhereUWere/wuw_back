import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from 'src/s3/s3.service';
import { createMock } from '@golevelup/ts-jest';
import { S3Client } from '@aws-sdk/client-s3';

describe('S3Service', () => {
    let s3Service: S3Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [S3Service, { provide: 'S3_CLIENT', useValue: createMock<S3Client>() }],
        }).compile();

        s3Service = module.get<S3Service>(S3Service);
    });

    it('should be defined', () => {
        expect(s3Service).toBeDefined();
    });
});
