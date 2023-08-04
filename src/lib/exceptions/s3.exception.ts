import { HttpStatus } from '@nestjs/common';
import { S3ExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class S3ServiceExecutionFailedException extends BaseException {
    constructor() {
        super(S3ExceptionCodeEnum.S3ServiceExecutionFailed, HttpStatus.NOT_IMPLEMENTED);
    }
}
