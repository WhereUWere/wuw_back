import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class PostBreakOutReq {
    @Expose({ name: 'password' })
    @IsString()
    private readonly _password: string;

    constructor(password: string) {
        this._password = password;
    }

    @ApiProperty()
    get password(): string {
        return this._password;
    }
}
