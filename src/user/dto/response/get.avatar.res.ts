import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class GetAvatarRes {
    @Exclude()
    private readonly _url: string | null;

    constructor(url: string | null) {
        this._url = url;
    }

    @ApiProperty()
    @Expose()
    get url(): string | null {
        return this._url;
    }
}
