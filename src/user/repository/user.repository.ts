import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User as UserModel } from '@prisma/client';

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

    async findUserByEmail(email: string): Promise<UserModel | null> {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async createAndSave(email: string, nickname: string, password: string): Promise<UserModel> {
        return await this.prisma.user.create({
            data: {
                email,
                password,
                profile: {
                    create: {
                        nickname,
                    },
                },
            },
        });
    }
}
