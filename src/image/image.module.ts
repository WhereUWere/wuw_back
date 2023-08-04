import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { S3Service } from 'src/s3/s3.service';
import { ProfileRepository } from 'src/user/repository/profile.repository';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [ImageService, S3Service, ProfileRepository],
    exports: [ImageService],
})
export class ImageModule {}
