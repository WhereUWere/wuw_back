import { AwsConfigProps } from 'src/config/interface/config.interface';

export type S3Bucket = Pick<AwsConfigProps, 'awsAvatarS3Bucket'>;
