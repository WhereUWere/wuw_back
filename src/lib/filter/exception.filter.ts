import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseException } from '../exceptions/base/base.exception';
import { UnCatchedException } from '../exceptions/uncatch.exception';
import { format } from 'date-fns';
import { DateFormatEnum } from '../utils/dates/date.format';
import { api } from 'src/config/apiConfig';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const res = exception instanceof BaseException ? exception : new UnCatchedException();

        res.timestamp = format(new Date(), DateFormatEnum.Datetime);
        res.path = httpAdapter.getRequestUrl(ctx.getRequest());

        if (api.nodeEnv === 'development') console.error(exception);

        httpAdapter.reply(
            ctx.getResponse(),
            {
                errorCode: res.errorCode,
                statusCode: res.statusCode,
                timestamp: res.timestamp,
                path: res.path,
            },
            res.getStatus(),
        );
    }
}
