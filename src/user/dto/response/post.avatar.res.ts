import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostAvatarRes {
    @Exclude()
    _url: string;

    constructor(url: string) {
        this._url = url;
    }

    @ApiProperty()
    @Expose()
    get url(): string {
        return this._url;
    }
}
