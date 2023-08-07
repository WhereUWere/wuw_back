import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class DeleteAvatarRes {
    @Exclude()
    private readonly _url: string;

    constructor(url: string) {
        this._url = url;
    }

    @Expose()
    @ApiProperty()
    get url(): string {
        return this._url;
    }
}
