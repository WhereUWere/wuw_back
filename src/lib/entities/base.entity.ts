import { ApiProperty } from '@nestjs/swagger';
import { IBase } from '../interfaces/base.interface';

export class BaseEntity implements IBase {
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ required: false, nullable: true })
    deletedAt: Date | null;

    constructor(createdAt: Date, updatedAt: Date, deletedAt: Date | null) {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}
