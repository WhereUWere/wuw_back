import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { http } from 'src/config/httpConfig';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({}),
        HttpModule.register({
            timeout: http.httpTimeout,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, ProfileRepository],
    exports: [AuthService],
})
export class AuthModule {}
