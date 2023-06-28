import { HttpConfigProps } from './interface/config.interface';

export const http: HttpConfigProps = {
    httpTimeout: parseInt(process.env.HTTP_TIMEOUT as string),
};
