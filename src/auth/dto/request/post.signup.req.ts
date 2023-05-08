import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class PostSignUpReq {
    @Expose({ name: 'email' })
    @IsEmail()
    private readonly _email: string;

    @Expose({ name: 'nickname' })
    @IsString()
    private readonly _nickname: string;

    @Expose({ name: 'password' })
    @IsString()
    private readonly _password: string;

    constructor(email: string, nickname: string, password: string) {
        this._email = email;
        this._nickname = nickname;
        this._password = password;
    }

    @ApiProperty()
    get email(): string {
        return this._email;
    }

    @ApiProperty()
    get nickname(): string {
        return this._nickname;
    }

    @ApiProperty()
    get password(): string {
        return this._password;
    }
}
