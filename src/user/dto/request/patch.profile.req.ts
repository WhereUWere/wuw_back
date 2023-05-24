import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class PatchProfileReq {
    @Expose({ name: 'nickname' })
    @Length(1, 20)
    @IsString()
    private readonly _nickname: string;

    @Expose({ name: 'phoneNumber' })
    @IsOptional()
    @Length(11, 11)
    @IsNumberString()
    private readonly _phoneNumber: string | null;

    @Expose({ name: 'birthOfDate' })
    @IsOptional()
    @Length(8, 8)
    @IsNumberString()
    private readonly _birthOfDate: string | null;

    @Expose({ name: 'bio' })
    @IsOptional()
    @Length(1, 1000)
    @IsString()
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
    get nickname(): string {
        return this._nickname;
    }

    @ApiProperty({ required: true, nullable: true })
    get phoneNumber(): string | null {
        return this._phoneNumber;
    }

    @ApiProperty({ required: true, nullable: true })
    get birthOfDate(): string | null {
        return this._birthOfDate;
    }

    @ApiProperty({ required: true, nullable: true })
    get bio(): string | null {
        return this._bio;
    }
}
