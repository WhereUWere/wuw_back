import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthRepository } from './repository/auth.repository';

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
})
export class AuthModule {}
