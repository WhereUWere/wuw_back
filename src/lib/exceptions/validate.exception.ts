import { HttpStatus } from '@nestjs/common';
import { ValidateExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class ValidateException extends BaseException {
    constructor() {
        super(ValidateExceptionCodeEnum.Failed, HttpStatus.BAD_REQUEST);
    }
}
