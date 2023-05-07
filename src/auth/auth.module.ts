import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { JwtModule } from '@nestjs/jwt';
import { auth } from 'src/config/authConfig';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: auth.jwtSecret,
            signOptions: { expiresIn: auth.jwtExpireTime },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, ProfileRepository],
})
export class AuthModule {}
