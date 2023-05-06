import { ApiProperty } from '@nestjs/swagger';
import { Role, User as UserModel } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { format } from 'date-fns';
import { DateFormatEnum } from 'src/lib/utils/dates/date.format';

export class PostSignUpRes {
    @Exclude()
    private readonly _userId: number;

    @Exclude()
    private readonly _email: string;

    @Exclude()
    private readonly _role: Role;

    @Exclude()
    private readonly _registeredAt: Date;

    constructor(user: UserModel) {
        this._userId = user.userId;
        this._email = user.email;
        this._role = user.role;
        this._registeredAt = user.registeredAt;
    }

    @ApiProperty()
    @Expose()
    get userId(): number {
        return this._userId;
    }

    @ApiProperty()
    @Expose()
    get email(): string {
        return this._email;
    }

    @ApiProperty()
    @Expose()
    get role(): Role {
        return this._role;
    }

    @ApiProperty()
    @Expose()
    get registeredAt(): string {
        return format(this._registeredAt, DateFormatEnum.Datetime);
    }
}
