import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostSignOutRes {
    @Exclude()
    private readonly _result: string;

    constructor(result: string) {
        this._result = result;
    }

    @ApiProperty()
    @Expose()
    get result(): string {
        return this._result;
    }
}
