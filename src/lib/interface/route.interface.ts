import { HttpStatus, Type } from '@nestjs/common';

export interface IRouteOptions {
    endPoint: string;
    summary: string;
    type: Type<unknown> | Function | [Function] | Record<string, any> | string;
    isArray?: boolean;
    status?: HttpStatus;
}
