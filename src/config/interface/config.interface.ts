export interface ApiConfigProps {
    nodeEnv: string;
    apiVersion: string;
    apiPort: number;
    globalPrefix: string;
    swaggerPrefix: string;
}

export interface AuthConfigProps {
    jwtSecret: string;
    jwtExpireTime: string;
    hashSalt: number;
    kakaoServerUrl: string;
}

export interface HttpConfigProps {
    httpTimeout: number;
}
