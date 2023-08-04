import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UserRepository } from './repository/user.repository';
import { ProfileRepository } from './repository/profile.repository';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [PrismaModule, ImageModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, ProfileRepository],
    exports: [UserRepository],
})
export class UserModule {}
