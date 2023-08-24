import { HttpStatus } from '@nestjs/common';
import { EmailExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class EmailServiceExecutionFailedException extends BaseException {
    constructor() {
        super(EmailExceptionCodeEnum.EmailServiceExecutionFailed, HttpStatus.NOT_IMPLEMENTED);
    }
}
