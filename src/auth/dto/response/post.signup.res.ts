import { ApiProperty } from '@nestjs/swagger';
import { Role, User as UserModel } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { format } from 'date-fns';
import { DateFormatEnum } from 'src/lib/utils/dates/date.format';

export class PostSignUpRes {
    @Exclude()
    private readonly _nickname: string;

    @Exclude()
    private readonly _jwtToken: string;

    constructor(nickname: string, jwtToken: string) {
        this._nickname = nickname;
        this._jwtToken = jwtToken;
    }

    @ApiProperty()
    @Expose()
    get nickname(): string {
        return this._nickname;
    }

    @ApiProperty()
    @Expose()
    get jwtToken(): string {
        return this._jwtToken;
    }
}
