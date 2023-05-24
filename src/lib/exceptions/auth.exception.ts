import { HttpStatus } from '@nestjs/common';
import { AuthExceptionCodeEnum } from '../enum/exception.enum';
import { BaseException } from './base/base.exception';

export class EmailNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.EmailNotFound, HttpStatus.NOT_FOUND);
    }
}

export class NotAuthenticatedException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.NotAuthenticated, HttpStatus.UNAUTHORIZED);
    }
}

export class EmailExistsException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.EmailExists, HttpStatus.BAD_REQUEST);
    }
}

export class JwtInvalidTokenException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtInvalidToken, HttpStatus.UNAUTHORIZED);
    }
}

export class JwtUserNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtUserNotFound, HttpStatus.NOT_FOUND);
    }
}

export class JwtExpiredException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtExpired, HttpStatus.UNAUTHORIZED);
    }
}

export class JwtInvalidSignatureException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtInvalidSignature, HttpStatus.UNAUTHORIZED);
    }
}

export class UserNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.UserNotFound, HttpStatus.NOT_FOUND);
    }
}
