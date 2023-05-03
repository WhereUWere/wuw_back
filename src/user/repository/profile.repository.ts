import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findUserIdByNickname(nickname: string): Promise<{ userId: number } | null> {
        return await this.prisma.profile.findUnique({
            where: {
                nickname,
            },
            select: {
                userId: true,
            },
        });
    }
}
