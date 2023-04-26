import { ApiProperty } from '@nestjs/swagger';
import { Profile as ProfileModel } from '@prisma/client';
import { BaseEntity } from 'src/lib/entities/base.entity';

export class ProfileEntity extends BaseEntity implements ProfileModel {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    phoneNumber: string | null;

    @ApiProperty()
    birthOfDate: string | null;

    @ApiProperty()
    avatar: string | null;

    @ApiProperty()
    bio: string | null;

    constructor(profile: ProfileModel) {
        super(profile.createdAt, profile.updatedAt, profile.deletedAt);
        this.userId = profile.userId;
        this.nickname = profile.nickname;
        this.phoneNumber = profile.phoneNumber;
        this.birthOfDate = profile.birthOfDate;
        this.avatar = profile.avatar;
        this.bio = profile.bio;
    }
}
