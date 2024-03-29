import { HttpStatus } from '@nestjs/common';
import { ImageExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class UnsupportedMimetypeException extends BaseException {
    constructor() {
        super(ImageExceptionCodeEnum.UnsupportedMimetype, HttpStatus.BAD_REQUEST);
    }
}

export class ExcessFileMaxSizeException extends BaseException {
    constructor() {
        super(ImageExceptionCodeEnum.ExcessFileMaxSize, HttpStatus.BAD_REQUEST);
    }
}
