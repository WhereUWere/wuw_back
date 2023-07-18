import { Injectable } from '@nestjs/common';
import { IPrismaMiddleware } from './interfaces/prisma.middleware.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaMiddleware implements IPrismaMiddleware {
    userFindMiddlewareFunc: Prisma.Middleware = async (params, next) => {
        if (params.model == 'User') {
            if (params.action == 'findUnique' || params.action == 'findFirst') {
                params.action = 'findFirst';
                return next({
                    ...params,
                    args: {
                        ...params.args,
                        where: {
                            ...params.args?.where,
                            deletedAt: null,
                        },
                    },
                });
            }
            if (params.action == 'findMany') {
                return next({
                    ...params,
                    args: {
                        ...params.args,
                        where: {
                            ...params.args?.where,
                            deletedAt: null,
                        },
                    },
                });
            }
        }
        return next(params);
    };

    profileFindMiddlewareFunc: Prisma.Middleware = async (params, next) => {
        if (params.model == 'Profile') {
            if (params.action == 'findUnique' || params.action == 'findFirst') {
                params.action = 'findFirst';
                return next({
                    ...params,
                    args: {
                        ...params.args,
                        where: {
                            ...params.args?.where,
                            deletedAt: null,
                        },
                    },
                });
            }
            if (params.action == 'findMany') {
                return next({
                    ...params,
                    args: {
                        ...params.args,
                        where: {
                            ...params.args?.where,
                            deletedAt: null,
                        },
                    },
                });
            }
        }
        return next(params);
    };
}
