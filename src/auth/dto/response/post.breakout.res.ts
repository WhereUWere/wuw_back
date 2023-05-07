import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { format } from 'date-fns';
import { DateFormatEnum } from 'src/lib/utils/dates/date.format';

export class PostBreakOutRes {
    @Exclude()
    private readonly _deletedAt: Date;

    constructor(deletedAt: Date) {
        this._deletedAt = deletedAt;
    }

    @ApiProperty()
    @Expose()
    get deletedAt(): string {
        return format(this._deletedAt, DateFormatEnum.Datetime);
    }
}
