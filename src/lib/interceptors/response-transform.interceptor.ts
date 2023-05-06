import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { BaseResponse } from '../response/base.response';
import { Observable, map } from 'rxjs';

export class ResponseTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        return next.handle().pipe(
            map((data) => {
                return new BaseResponse(data, response.statusCode);
            }),
        );
    }
}
