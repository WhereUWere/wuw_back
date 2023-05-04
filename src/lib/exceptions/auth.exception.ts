import { HttpStatus } from '@nestjs/common';
import { AuthExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class EmailNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.EmailNotFound, HttpStatus.NOT_FOUND);
    }
}

export class PasswordNotMatchException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.PasswordNotMatch, HttpStatus.BAD_REQUEST);
    }
}
