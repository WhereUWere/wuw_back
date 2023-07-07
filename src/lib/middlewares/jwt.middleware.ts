import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserRepository } from 'src/user/repository/user.repository';
import {
    JwtAccessTokenExpiredException,
    JwtAccessTokenInvalidSignatureException,
    JwtInvalidTokenException,
    JwtUserNotFoundException,
} from '../exceptions/auth.exception';
import { UserEntity } from 'src/user/entities/user.entity';
import { IUserInfoRequest } from '../utils/types/request.type';
import { BaseException } from '../exceptions/base/base.exception';
import { AuthExceptionCodeEnum } from '../enum/exception.enum';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService,
        private readonly userRepository: UserRepository,
    ) {}
    async use(req: IUserInfoRequest, _: Response, next: NextFunction) {
        if (req.headers['authorization']) {
            const token = req.headers['authorization'].replace('Bearer ', '');
            try {
                const decodedObj = await this.authService.verifyAccessToken(token);
                const userId = decodedObj['userId'];
                if (!userId) throw new JwtInvalidTokenException();
                const userModel = await this.userRepository.findUserByUserId(userId);
                if (!userModel) throw new JwtUserNotFoundException();
                const userEntity = new UserEntity(userModel);
                req['user'] = userEntity;
            } catch (error) {
                if (error instanceof BaseException) {
                    if (error.message === AuthExceptionCodeEnum.JwtInvalidToken)
                        throw new JwtInvalidTokenException();
                    if (error.message === AuthExceptionCodeEnum.JwtUserNotFound)
                        throw new JwtUserNotFoundException();
                    if (error.message === AuthExceptionCodeEnum.JwtAccessTokenExpired)
                        throw new JwtAccessTokenExpiredException();
                    if (error.message === AuthExceptionCodeEnum.JwtAccessTokenInvalidSignature)
                        throw new JwtAccessTokenInvalidSignatureException();
                }
            }
        }
        next();
    }
}
