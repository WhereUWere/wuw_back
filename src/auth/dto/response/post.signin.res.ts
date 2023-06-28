import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostSignInRes {
    @Exclude()
    private readonly _nickname: string;

    @Exclude()
    private readonly _accessToken: string;

    constructor(nickname: string, accessToken: string) {
        this._nickname = nickname;
        this._accessToken = accessToken;
    }

    @ApiProperty()
    @Expose()
    get nickname(): string {
        return this._nickname;
    }

    @ApiProperty()
    @Expose()
    get accessToken(): string {
        return this._accessToken;
    }
}
