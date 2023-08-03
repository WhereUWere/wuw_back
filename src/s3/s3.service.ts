import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { aws } from 'src/config/awsConfig';

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
}
