import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { aws } from 'src/config/awsConfig';
import { S3ServiceExecutionFailedException } from 'src/lib/exceptions/s3.exception';

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: aws.awsRegion,
            credentials: {
                accessKeyId: aws.awsS3AccessKey,
                secretAccessKey: aws.awsS3SecretAccessKey,
            },
        });
    }

    async putObject(file: Express.Multer.File, key: string, bucketName: string): Promise<void> {
        const params = {
            Body: file.buffer,
            Key: key,
            Bucket: bucketName,
        };

        try {
            await this.s3Client.send(new PutObjectCommand(params));
        } catch (error) {
            throw new S3ServiceExecutionFailedException();
        }
    }

    async deleteObject(key: string, bucketName: string): Promise<void> {
        const params = {
            Key: key,
            Bucket: bucketName,
        };

        try {
            await this.s3Client.send(new DeleteObjectCommand(params));
        } catch (error) {
            throw new S3ServiceExecutionFailedException();
        }
    }

    async clearDirectory(path: string, bucketName: string): Promise<void> {
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
        } catch (error) {
            throw new S3ServiceExecutionFailedException();
        }
    }
}
