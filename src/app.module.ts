import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { JwtMiddleware } from './lib/middlewares/jwt.middleware';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().required(),
                API_HOST: Joi.string().required(),
                API_VERSION: Joi.string().required(),
                API_PORT: Joi.string().required(),
                SWAGGER_PREFIX: Joi.string().required(),
                DB_USER: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                DB_HOST: Joi.string().required(),
                DB_URL: Joi.string().required(),
                JWT_ACCESS_SECRET: Joi.string().required(),
                JWT_ACCESS_EXPIRE_TIME: Joi.string().required(),
                JWT_REFRESH_SECRET: Joi.string().required(),
                JWT_REFRESH_EXPIRE_TIME: Joi.string().required(),
                HASH_SALT: Joi.number().required(),
                KAKAO_SERVER_URL: Joi.string().required(),
                HTTP_TIMEOUT: Joi.number().required(),
            }),
        }),
        UserModule,
        AuthModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(AuthController, UserController);
    }
}
