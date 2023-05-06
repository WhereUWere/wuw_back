import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class PostSignInReq {
    @Expose({ name: 'email' })
    @IsEmail()
    private readonly _email: string;

    @Expose({ name: 'password' })
    @IsString()
    private readonly _password: string;

    constructor(email: string, password: string) {
        this._email = email;
        this._password = password;
    }

    @ApiProperty()
    get email(): string {
        return this._email;
    }

    @ApiProperty()
    get password(): string {
        return this._password;
    }
}
