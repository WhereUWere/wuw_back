import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PostSignInKakaoRes {
    @Exclude()
    private readonly _isRegistered: boolean;

    @Exclude()
    private readonly _email: string;

    @Exclude()
    private readonly _accessToken: string | null;

    constructor(isRegistered: boolean, email: string, accessToken?: string) {
        this._isRegistered = isRegistered;
        this._email = email;
        this._accessToken = accessToken ?? null;
    }

    @Expose()
    @ApiProperty()
    get isRegistered(): boolean {
        return this._isRegistered;
    }

    @Expose()
    @ApiProperty()
    get email(): string {
        return this._email;
    }

    @Expose()
    @ApiProperty()
    get accessToken(): string | null {
        return this._accessToken;
    }
}
