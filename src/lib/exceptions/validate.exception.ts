import { HttpStatus } from '@nestjs/common';
import { ValidateExceptionCodeEunm } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class ValidateException extends BaseException {
    constructor() {
        super(ValidateExceptionCodeEunm.Failed, HttpStatus.BAD_REQUEST);
    }
}
