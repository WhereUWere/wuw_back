import { AuthConfigProps } from './interface/config.interface';

export const auth: AuthConfigProps = {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpireTime: process.env.JWT_EXPIRE_TIME as string,
    hashSalt: parseInt(process.env.HASH_SALT as string),
};
