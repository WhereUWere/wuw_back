import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostSendEmailRes {
    @Exclude()
    private readonly _to: string;

    @Exclude()
    private readonly _subject: string;

    constructor(to: string, subject: string) {
        this._to = to;
        this._subject = subject;
    }

    @Expose()
    @ApiProperty()
    get to(): string {
        return this._to;
    }

    @Expose()
    @ApiProperty()
    get subject(): string {
        return this._subject;
    }
}
