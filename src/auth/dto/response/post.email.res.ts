import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostEmailRes {
    @Exclude()
    private readonly _isDuplicated: boolean;

    constructor(isDuplicated: boolean) {
        this._isDuplicated = isDuplicated;
    }

    @ApiProperty()
    @Expose()
    get isDuplicated(): boolean {
        return this._isDuplicated;
    }
}
