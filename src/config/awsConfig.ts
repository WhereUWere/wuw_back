import { AwsConfigProps } from './interface/config.interface';

export const aws: AwsConfigProps = {
    awsRegion: process.env.AWS_REGION as string,
    awsS3AccessKey: process.env.AWS_S3_ACCESS_KEY as string,
    awsS3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    awsAvatarS3Bucket: process.env.AWS_AVATAR_S3_BUCKET as string,
};
