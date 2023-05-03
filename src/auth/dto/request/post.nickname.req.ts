import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class PostNicknameReq {
    @Expose({ name: 'nickname' })
    @IsString()
    private readonly _nickname: string;

    constructor(nickname: string) {
        this._nickname = nickname;
    }

    @ApiProperty()
    get nickname(): string {
        return this._nickname;
    }
}
