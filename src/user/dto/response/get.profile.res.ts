import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class GetProfileRes {
    @Exclude()
    private readonly _nickname: string;

    @Exclude()
    private readonly _phoneNumber: string | null;

    @Exclude()
    private readonly _birthOfDate: string | null;

    @Exclude()
    private readonly _bio: string | null;

    constructor(
        nickname: string,
        phoneNumber: string | null,
        birthOfDate: string | null,
        bio: string | null,
    ) {
        this._nickname = nickname;
        this._phoneNumber = phoneNumber;
        this._birthOfDate = birthOfDate;
        this._bio = bio;
    }

    @ApiProperty()
    @Expose()
    get nickname(): string {
        return this._nickname;
    }

    @ApiProperty({ nullable: true, type: String })
    @Expose()
    get phoneNumber(): string | null {
        return this._phoneNumber;
    }

    @ApiProperty({ nullable: true, type: String })
    @Expose()
    get birthOfDate(): string | null {
        return this._birthOfDate;
    }

    @ApiProperty({ nullable: true, type: String })
    @Expose()
    get bio(): string | null {
        return this._bio;
    }
}
