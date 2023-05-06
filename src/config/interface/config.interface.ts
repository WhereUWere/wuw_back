export interface ApiConfigProps {
    nodeEnv: string;
    apiVersion: string;
    apiPort: number;
    globalPrefix: string;
    swaggerPrefix: string;
}

export interface AuthConfigProps {
    hashSalt: number;
}
