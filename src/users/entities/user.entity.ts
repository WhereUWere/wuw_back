import { ApiProperty } from '@nestjs/swagger';
import { Role, User as UserModel } from '@prisma/client';

export class UserEntity implements UserModel {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    email: string;

    password: string;

    @ApiProperty()
    role: Role;

    @ApiProperty()
    registeredAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ required: false, nullable: true })
    deletedAt: Date | null;

    constructor(user: UserModel) {
        this.userId = user.userId;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.registeredAt = user.registeredAt;
        this.updatedAt = user.updatedAt;
        this.deletedAt = user.deletedAt;
    }
}
