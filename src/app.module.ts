import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import * as Joi from 'joi';
import { auth } from './config/authConfig';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().required(),
                API_VERSION: Joi.string().required(),
                API_PORT: Joi.string().required(),
                SWAGGER_PREFIX: Joi.string().required(),
                DB_USER: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_URL: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRE_TIME: Joi.string().required(),
                HASH_SALT: Joi.number().required(),
            }),
        }),
        UserModule,
        AuthModule,
    ],
})
export class AppModule {}
