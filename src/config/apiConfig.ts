import { ApiConfigProps } from './interface/config.interface';

export const api: ApiConfigProps = {
    nodeEnv: process.env.NODE_ENV as string,
    apiVersion: process.env.API_VERSION as string,
    apiPort: parseInt(process.env.API_PORT as string),
    globalPrefix: `/api/${process.env.API_VERSION}` as string,
    swaggerPrefix: `/api/${process.env.API_VERSION}/${process.env.SWAGGER_PREFIX}` as string,
};
