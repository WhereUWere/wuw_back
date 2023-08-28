import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from 'src/s3/s3.service';
import { createMock } from '@golevelup/ts-jest';
import { S3Client } from '@aws-sdk/client-s3';
import { S3ServiceExecutionFailedException } from 'src/lib/exceptions/s3.exception';
import { aws } from 'src/config/awsConfig';

describe('S3Service', () => {
    let s3Service: S3Service;
    let s3Client: S3Client;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [S3Service, { provide: 'S3_CLIENT', useValue: createMock<S3Client>() }],
        }).compile();

        s3Service = module.get<S3Service>(S3Service);
        s3Client = module.get<S3Client>('S3_CLIENT');
    });

    it('should be defined', () => {
        expect(s3Service).toBeDefined();
    });

    describe('putObject', () => {
        it('putObject 가 정의되어 있다.', () => {
            expect(s3Service.putObject).toBeDefined;
        });
        it('업로드한 파일의 key 를 리턴한다.', async () => {
            const mFile = { buffer: Buffer.from('buffer') } as Express.Multer.File;
            const resDto = 'fakeKey';
            const result = await s3Service.putObject(mFile, 'fakeKey', 'fakeBucket');
            expect(result).toBe(resDto);
        });
        it('파일 업로드가 실패할 경우, S3ServiceExecutionFailedException 발생', async () => {
            const mFile = { buffer: Buffer.from('buffer') } as Express.Multer.File;
            s3Client.send = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = async () => await s3Service.putObject(mFile, 'fakeKey', 'fakeBucket');
            await expect(result).rejects.toThrowError(new S3ServiceExecutionFailedException());
        });
    });

    describe('deleteObject', () => {
        it('deleteObject 가 정의되어 있다.', () => {
            expect(s3Service.deleteObject).toBeDefined();
        });
        it('삭제한 파일의 key 를 리턴한다.', async () => {
            const resDto = 'fakeKey';
            const result = await s3Service.deleteObject('fakeKey', 'fakeBucket');
            expect(result).toBe(resDto);
        });
        it('파일 삭제가 실패할 경우, S3ServiceExecutionFailedException 발생', async () => {
            s3Client.send = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = async () => await s3Service.deleteObject('fakeKey', 'fakeBucket');
            await expect(result).rejects.toThrowError(new S3ServiceExecutionFailedException());
        });
    });

    describe('clearDirectory', () => {
        it('clearDirectory 가 정의되어 있다.', () => {
            expect(s3Service.clearDirectory).toBeDefined();
        });
        it('삭제한 디렉터리의 prefix 를 리턴한다.', async () => {
            s3Client.send = jest.fn().mockImplementationOnce(() => ({ keyCount: 0 }));
            const resDto = 'fakePrefix/';
            const result = await s3Service.clearDirectory('fakePrefix/', 'fakeBucket');
            expect(result).toBe(resDto);
        });
        it('디렉터리 삭제가 실패할 경우, S3ServiceExecutionFailedException 발생', async () => {
            s3Client.send = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = async () => await s3Service.clearDirectory('fakePrefix/', 'fakeBucket');
            await expect(result).rejects.toThrowError(new S3ServiceExecutionFailedException());
        });
    });

    describe('createS3ObjectFullUrl', () => {
        it('createS3ObjectFullUrl 이 정의되어 있다.', () => {
            expect(s3Service.createS3ObjectFullUrl).toBeDefined();
        });
        it('파일의 S3 스토리지 URL 을 생성하여 리턴한다.', () => {
            const resDto = `https://fakeBucket.s3.${aws.awsRegion}.amazonaws.com/fakePath`;
            const result = s3Service.createS3ObjectFullUrl('fakeBucket', 'fakePath');
            expect(result).toBe(resDto);
        });
    });
});
