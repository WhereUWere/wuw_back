import { Type } from '@nestjs/common';
import { BaseResponse } from './base.response';
import { ApiProperty } from '@nestjs/swagger';

export const apiResponseMapper = <
    T extends Type<unknown> | Function | [Function] | Record<string, any> | string,
>(
    type: T,
    isArray?: boolean,
) => {
    class ApiResponseMapper extends BaseResponse {
        @ApiProperty({ type, isArray })
        data: any;
    }

    return ApiResponseMapper;
};
