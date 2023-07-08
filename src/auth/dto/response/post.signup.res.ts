import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostSignUpRes {
    @Exclude()
    private readonly _nickname: string;

    @Exclude()
    private readonly _accessToken: string;

    @Exclude()
    private readonly _refreshToken: string;

    constructor(nickname: string, accessToken: string, refreshToken: string) {
        this._nickname = nickname;
        this._accessToken = accessToken;
        this._refreshToken = refreshToken;
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

    @Exclude()
    get refreshToken(): string {
        return this._refreshToken;
    }
}
