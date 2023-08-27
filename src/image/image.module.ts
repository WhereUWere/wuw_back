import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { PrismaModule } from 'prisma/prisma.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
    imports: [PrismaModule, S3Module],
    providers: [ImageService, ProfileRepository],
    exports: [ImageService],
})
export class ImageModule {}
