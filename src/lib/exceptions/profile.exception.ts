import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base.exception';
import { ProfileExceptionCodeEnum } from '../enum/exception.enum';

export class NicknameNotFoundException extends BaseException {
    constructor() {
        super(ProfileExceptionCodeEnum.NicknameNotFound, HttpStatus.NOT_FOUND);
    }
}
export class NicknameExistsException extends BaseException {
    constructor() {
        super(ProfileExceptionCodeEnum.NicknameExists, HttpStatus.BAD_REQUEST);
    }
}

export class ProfileNotFoundException extends BaseException {
    constructor() {
        super(ProfileExceptionCodeEnum.ProfileNotFound, HttpStatus.NOT_FOUND);
    }
}
