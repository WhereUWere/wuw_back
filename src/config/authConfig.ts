import { AuthConfigProps } from './interface/config.interface';

export const auth: AuthConfigProps = {
    hashSalt: parseInt(process.env.HASH_SALT as string),
};
