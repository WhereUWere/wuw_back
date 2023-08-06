export enum UncatchedExceptionCodeEnum {
    UnCatched = '9999',
}

export enum ValidateExceptionCodeEnum {
    Failed = '0000',
}

export enum AuthExceptionCodeEnum {
    EmailNotFound = '0001',
    NotAuthenticated = '0002',
    EmailExists = '0003',
    JwtInvalidToken = '0004',
    JwtUserNotFound = '0005',
    JwtAccessTokenExpired = '0006',
    JwtAccessTokenInvalidSignature = '0007',
    UserNotFound = '0008',
    KakaoAuthConfilct = '0009',
    KakaoEmailNotFound = '0010',
    CreateAccessTokenConflict = '0011',
    CreateRefreshTokenConflict = '0012',
    JwtRefreshTokenExpired = '0013',
    JwtRefreshTokenInvalidSignature = '0014',
    JwtRefreshTokenNotFound = '0015',
    UserRefreshTokenNotFound = '0016',
}

export enum ProfileExceptionCodeEnum {
    NicknameNotFound = '0100',
    NicknameExists = '0101',
    ProfileNotFound = '0102',
}

export enum ImageExceptionCodeEnum {
    UnsupportedMimetype = '0200',
    ExcessFileMaxSize = '0201',
}

export enum S3ExceptionCodeEnum {
    S3ServiceExecutionFailed = '0300',
}
