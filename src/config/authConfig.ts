import { AuthConfigProps } from './interface/config.interface';

export const auth: AuthConfigProps = {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
    jwtAccessExpireTime: process.env.JWT_ACCESS_EXPIRE_TIME as string,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
    jwtRefreshExpireTime: process.env.JWT_REFRESH_EXPIRE_TIME as string,
    hashSalt: parseInt(process.env.HASH_SALT as string),
    kakaoServerUrl: process.env.KAKAO_SERVER_URL as string,
};
