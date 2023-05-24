import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Profile as ProfileModel } from '@prisma/client';
import { IUpdateProfile } from '../interface/update.profile.interface';

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

    async findNicknameByUserId(userId: number): Promise<{ nickname: string } | null> {
        return await this.prisma.profile.findUnique({
            where: {
                userId,
            },
            select: {
                nickname: true,
            },
        });
    }

    async findOneByUserId(userId: number): Promise<ProfileModel | null> {
        return await this.prisma.profile.findUnique({
            where: {
                userId,
            },
        });
    }

    async updateProfileByUserId(userId: number, data: IUpdateProfile): Promise<ProfileModel> {
        return await this.prisma.profile.update({
            where: {
                userId,
            },
            data: {
                ...data,
            },
        });
    }
}
