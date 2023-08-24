import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PostSendEmailReq {
    @Expose({ name: 'to' })
    @IsEmail()
    @IsNotEmpty()
    private readonly _to: string;

    @Expose({ name: 'subject' })
    @IsString()
    @IsNotEmpty()
    private readonly _subject: string;

    @Expose({ name: 'content' })
    @IsString()
    @IsNotEmpty()
    private readonly _content: string;

    constructor(to: string, subject: string, content: string) {
        this._to = to;
        this._subject = subject;
        this._content = content;
    }

    @ApiProperty()
    get to(): string {
        return this._to;
    }

    @ApiProperty()
    get subject(): string {
        return this._subject;
    }

    @ApiProperty()
    get content(): string {
        return this._content;
    }
}
