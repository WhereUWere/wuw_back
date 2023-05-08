import { HttpStatus } from '@nestjs/common';
import { UncatchedExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class UnCatchedException extends BaseException {
    constructor() {
        super(UncatchedExceptionCodeEnum.UnCatched, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
