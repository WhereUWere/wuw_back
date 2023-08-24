export interface ApiConfigProps {
    nodeEnv: string;
    apiVersion: string;
    apiPort: number;
    globalPrefix: string;
    swaggerPrefix: string;
}

export interface AuthConfigProps {
    jwtAccessSecret: string;
    jwtAccessExpireTime: string;
    jwtRefreshSecret: string;
    jwtRefreshExpireTime: string;
    hashSalt: number;
    kakaoServerUrl: string;
}

export interface HttpConfigProps {
    httpTimeout: number;
}

export interface AwsConfigProps {
    awsRegion: string;
    awsS3AccessKey: string;
    awsS3SecretAccessKey: string;
    awsAvatarS3Bucket: string;
}

export interface FileConfigProps {
    avatarFileMaxSize: number;
}

export interface EmailConfigProps {
    emailAddress: string;
    emailPassword: string;
}
