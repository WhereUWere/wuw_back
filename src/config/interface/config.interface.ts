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
