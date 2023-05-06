import { Type } from '@nestjs/common';
import { BaseResponse } from './base.response';
import { ApiProperty } from '@nestjs/swagger';

export const apiResponseMapper = <
    T extends Type<unknown> | Function | [Function] | Record<string, any> | string,
>(
    type: T,
    isArray?: boolean,
) => {
    const descriptor = Object.getOwnPropertyDescriptor(type, 'name');
    class WrappedResponse extends BaseResponse {
        @ApiProperty({ type, isArray })
        data: any;
    }

    Object.defineProperty(WrappedResponse, 'name', {
        value: `Wrapped${descriptor?.value}`,
    });

    return WrappedResponse;
};
