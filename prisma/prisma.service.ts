import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMiddleware } from './prisma.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private readonly prismaMiddleware: PrismaMiddleware) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
        this.$use(this.prismaMiddleware.userFindMiddlewareFunc);
        this.$use(this.prismaMiddleware.profileFindMiddlewareFunc);
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
