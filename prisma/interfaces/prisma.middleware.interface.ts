import { Prisma } from '@prisma/client';

export interface IPrismaMiddleware {
    userFindMiddlewareFunc: Prisma.Middleware;
    profileFindMiddlewareFunc: Prisma.Middleware;
}
