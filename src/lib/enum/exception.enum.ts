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
    JwtInvalidToken = '0004',
    JwtUserNotFound = '0005',
    JwtExpired = '0006',
    JwtInvalidSignature = '0007',
    UserNotFound = '0008',
}

export enum ProfileExceptionCodeEnum {
    NicknameNotFound = '0100',
    NicknameExists = '0101',
    ProfileNotFound = '0102',
}
