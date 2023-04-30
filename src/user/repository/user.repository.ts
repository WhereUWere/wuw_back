import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findUserIdByEmail(email: string): Promise<{ userId: number } | null> {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                userId: true,
            },
        });
    }
}
