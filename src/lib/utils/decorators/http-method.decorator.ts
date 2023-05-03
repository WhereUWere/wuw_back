import {
    Get as GetMethod,
    Post as PostMethod,
    Patch as PatchMethod,
    Delete as DeleteMethod,
    applyDecorators,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IRouteOptions } from 'src/lib/interfaces/route.interface';
import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/lib/dto/response/base.response';

export function Get(options: IRouteOptions) {
    const { endPoint, summary, type, isArray, status } = options;
    const statusCode = status ?? HttpStatus.OK;
    return applyDecorators(
        GetMethod(endPoint),
        ApiOperation({ summary }),
        ApiResponse({
            type: apiResponseMapper(type, isArray),
            status: statusCode,
        }),
        HttpCode(statusCode),
    );
}

export function Post(options: IRouteOptions) {
    const { endPoint, summary, type, isArray, status } = options;
    const statusCode = status ?? HttpStatus.CREATED;
    return applyDecorators(
        PostMethod(endPoint),
        ApiOperation({ summary }),
        ApiResponse({
            type: apiResponseMapper(type, isArray),
            status: statusCode,
        }),
        HttpCode(statusCode),
    );
}

export function Patch(options: IRouteOptions) {
    const { endPoint, summary, type, isArray, status } = options;
    const statusCode = status ?? HttpStatus.OK;
    return applyDecorators(
        PatchMethod(endPoint),
        ApiOperation({ summary }),
        ApiResponse({
            type: apiResponseMapper(type, isArray),
            status: statusCode,
        }),
        HttpCode(statusCode),
    );
}

export function Delete(options: IRouteOptions) {
    const { endPoint, summary, type, isArray, status } = options;
    const statusCode = status ?? HttpStatus.OK;
    return applyDecorators(
        DeleteMethod(endPoint),
        ApiOperation({ summary }),
        ApiResponse({
            type: apiResponseMapper(type, isArray),
            status: statusCode,
        }),
        HttpCode(statusCode),
    );
}

const apiResponseMapper = <
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
