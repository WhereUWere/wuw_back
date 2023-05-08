import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostNicknameRes {
    @Exclude()
    private readonly _isDuplicated: boolean;

    constructor(isDuplicated: boolean) {
        this._isDuplicated = isDuplicated;
    }

    @Expose()
    @ApiProperty()
    get isDuplicated(): boolean {
        return this._isDuplicated;
    }
}
