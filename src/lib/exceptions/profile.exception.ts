import { HttpStatus } from '@nestjs/common';
import { AuthExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class NicknameExistsException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.NicknameExists, HttpStatus.BAD_REQUEST);
    }
}
