import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User as UserModel } from '@prisma/client';
import { now } from 'src/lib/utils/dates/date.utils';

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

    async findUserByUserId(userId: number): Promise<UserModel | null> {
        return await this.prisma.user.findUnique({
            where: {
                userId,
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

    async setEncryptedRefreshToken(userId: number, encryptedToken: string): Promise<UserModel> {
        return await this.prisma.user.update({
            where: {
                userId,
            },
            data: {
                refreshToken: encryptedToken,
            },
        });
    }

    async clearRefreshToken(userId: number): Promise<UserModel> {
        return await this.prisma.user.update({
            where: {
                userId,
            },
            data: {
                refreshToken: null,
            },
        });
    }

    async softDelete(userId: number, date: Date = now()): Promise<UserModel> {
        return await this.prisma.user.update({
            data: {
                email: `탈퇴한 이메일${userId}`,
                refreshToken: null,
                deletedAt: date,
            },
            where: {
                userId,
            },
        });
    }
}
