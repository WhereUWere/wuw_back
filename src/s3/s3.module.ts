import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { aws } from 'src/config/awsConfig';

@Module({
    providers: [
        S3Service,
        {
            provide: 'S3_CLIENT',
            useFactory: () => {
                return new S3Client({
                    region: aws.awsRegion,
                    credentials: {
                        accessKeyId: aws.awsS3AccessKey,
                        secretAccessKey: aws.awsS3SecretAccessKey,
                    },
                });
            },
        },
    ],
    exports: [S3Service],
})
export class S3Module {}
