export enum UncatchedExceptionCodeEnum {
    UnCatched = '9999',
}

export enum ValidateExceptionCodeEunm {
    Failed = '0000',
}

export enum AuthExceptionCodeEnum {
    EmailNotFound = '0001',
    NotAuthenticated = '0002',
    EmailExists = '0003',
    NicknameExists = '0004',
    NicknameNotFound = '0005',
    JwtInvalidToken = '0006',
    JwtUserNotFound = '0007',
    JwtExpired = '0008',
    JwtInvalidSignature = '0009',
}
