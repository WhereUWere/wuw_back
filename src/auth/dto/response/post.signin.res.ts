import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostSignInRes {
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
