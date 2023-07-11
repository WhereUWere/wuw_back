import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class GetAccessTokenRes {
    @Exclude()
    private readonly _accessToken: string;

    constructor(accessToken: string) {
        this._accessToken = accessToken;
    }

    @ApiProperty()
    @Expose()
    get accessToken(): string {
        return this._accessToken;
    }
}
