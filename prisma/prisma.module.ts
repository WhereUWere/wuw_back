import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaMiddleware } from './prisma.middleware';

@Module({
    providers: [PrismaService, PrismaMiddleware],
    exports: [PrismaService],
})
export class PrismaModule {}
