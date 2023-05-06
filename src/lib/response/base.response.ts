import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
    @ApiProperty()
    data: any;

    @ApiProperty()
    statusCode: number;

    constructor(data: any, statusCode: number) {
        this.data = data;
        this.statusCode = statusCode;
    }
}
