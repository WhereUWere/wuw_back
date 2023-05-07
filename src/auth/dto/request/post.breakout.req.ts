import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostBreakOutReq {
    @Expose({ name: 'password' })
    private readonly _password: string;

    constructor(password: string) {
        this._password = password;
    }

    @ApiProperty()
    get password(): string {
        return this._password;
    }
}
