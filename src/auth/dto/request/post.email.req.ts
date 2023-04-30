import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class PostEmailReq {
    @Expose({ name: 'email' })
    @IsEmail()
    private readonly _email: string;

    constructor(email: string) {
        this._email = email;
    }

    @ApiProperty()
    get email(): string {
        return this._email;
    }
}
