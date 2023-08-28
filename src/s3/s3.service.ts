import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { aws } from 'src/config/awsConfig';
import { S3ServiceExecutionFailedException } from 'src/lib/exceptions/s3.exception';

@Injectable()
export class S3Service {
    constructor(@Inject('S3_CLIENT') private readonly s3Client: S3Client) {}

    async putObject(file: Express.Multer.File, key: string, bucketName: string): Promise<string> {
        const params = {
            Body: file.buffer,
            Key: key,
            Bucket: bucketName,
        };

        try {
            await this.s3Client.send(new PutObjectCommand(params));
            return key;
        } catch (error) {
            throw new S3ServiceExecutionFailedException();
        }
    }

    async deleteObject(key: string, bucketName: string): Promise<string> {
        const params = {
            Key: key,
            Bucket: bucketName,
        };

        try {
            await this.s3Client.send(new DeleteObjectCommand(params));
            return key;
        } catch (error) {
            throw new S3ServiceExecutionFailedException();
        }
    }

    async clearDirectory(path: string, bucketName: string): Promise<string> {
        try {
            const listParams = {
                Prefix: path,
                Bucket: bucketName,
            };
            const list = await this.s3Client.send(new ListObjectsV2Command(listParams));

            if (list.KeyCount) {
                const deleteParams = {
                    Bucket: bucketName,
                    Delete: {
                        Objects: list.Contents?.map((object) => ({ Key: object.Key })),
                        Quiet: false,
                    },
                };

                await this.s3Client.send(new DeleteObjectsCommand(deleteParams));
            }
            return path;
        } catch (error) {
            throw new S3ServiceExecutionFailedException();
        }
    }

    createS3ObjectFullUrl(bucketName: string, path: string): string {
        return `https://${bucketName}.s3.${aws.awsRegion}.amazonaws.com/${path}`;
    }
}
