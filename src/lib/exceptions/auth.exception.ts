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

export class JwtAccessTokenExpiredException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtAccessTokenExpired, HttpStatus.UNAUTHORIZED);
    }
}

export class JwtAccessTokenInvalidSignatureException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtAccessTokenInvalidSignature, HttpStatus.UNAUTHORIZED);
    }
}

export class UserNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.UserNotFound, HttpStatus.NOT_FOUND);
    }
}

export class KakaoAuthConflictException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.KakaoAuthConfilct, HttpStatus.CONFLICT);
    }
}

export class KakaoEmailNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.KakaoEmailNotFound, HttpStatus.NOT_FOUND);
    }
}

export class CreateAccessTokenConflictException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.CreateAccessTokenConflict, HttpStatus.CONFLICT);
    }
}

export class CreateRefreshTokenConflictException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.CreateRefreshTokenConflict, HttpStatus.CONFLICT);
    }
}

export class JwtRefreshTokenExpiredException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtRefreshTokenExpired, HttpStatus.UNAUTHORIZED);
    }
}

export class JwtRefreshTokenInvalidSignatureException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtRefreshTokenInvalidSignature, HttpStatus.UNAUTHORIZED);
    }
}

export class JwtRefreshTokenNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.JwtRefreshTokenNotFound, HttpStatus.BAD_REQUEST);
    }
}

export class UserRefreshTokenNotFoundException extends BaseException {
    constructor() {
        super(AuthExceptionCodeEnum.UserRefreshTokenNotFound, HttpStatus.NOT_FOUND);
    }
}
