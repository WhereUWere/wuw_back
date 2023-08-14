import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Profile as ProfileModel } from '@prisma/client';
import { IUpdateProfile } from '../interface/update.profile.interface';
import { now } from 'src/lib/utils/dates/date.utils';

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

    async doesUserHaveAvatar(userId: number): Promise<boolean> {
        const profile = await this.prisma.profile.findUnique({
            where: {
                userId,
            },
        });

        return profile?.avatar ? true : false;
    }

    async findAvatarByUserId(userId: number): Promise<{ avatar: string | null } | null> {
        return await this.prisma.profile.findUnique({
            where: {
                userId,
            },
            select: {
                avatar: true,
            },
        });
    }

    async updateAvatarByUserId(userId: number, path: string): Promise<ProfileModel> {
        return await this.prisma.profile.update({
            where: {
                userId,
            },
            data: {
                avatar: path,
            },
        });
    }

    async deleteAvatarByUserId(userId: number): Promise<ProfileModel> {
        return await this.prisma.profile.update({
            where: {
                userId,
            },
            data: {
                avatar: null,
            },
        });
    }

    async softDelete(userId: number, date: Date = now()): Promise<ProfileModel> {
        return await this.prisma.profile.update({
            data: {
                nickname: `탈퇴한 유저${userId}`,
                phoneNumber: null,
                birthOfDate: null,
                avatar: null,
                bio: null,
                deletedAt: date,
            },
            where: {
                userId,
            },
        });
    }
}
