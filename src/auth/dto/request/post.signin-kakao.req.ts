import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostSignInKakaoReq {
    @Expose({ name: 'kakaoAccessToken' })
    @IsString()
    @IsNotEmpty()
    private readonly _kakaoAccessToken: string;

    constructor(kakaoAccessToken: string) {
        this._kakaoAccessToken = kakaoAccessToken;
    }

    @ApiProperty()
    get kakaoAccessToken(): string {
        return this._kakaoAccessToken;
    }
}
