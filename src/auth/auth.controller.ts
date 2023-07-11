import { Body, Controller, HttpStatus, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Get, Post } from 'src/lib/utils/decorators/http-method.decorator';
import { PostEmailRes } from './dto/response/post.email.res';
import { PostEmailReq } from './dto/request/post.email.req';
import { PostNicknameRes } from './dto/response/post.nickname.res';
import { PostNicknameReq } from './dto/request/post.nickname.req';
import { PostSignUpRes } from './dto/response/post.signup.res';
import { PostSignUpReq } from './dto/request/post.signup.req';
import { PostSignInRes } from './dto/response/post.signin.res';
import { PostSignInReq } from './dto/request/post.signin.req';
import { PostBreakOutRes } from './dto/response/post.breakout.res';
import { PostBreakOutReq } from './dto/request/post.breakout.req';
import { AuthUser } from 'src/lib/utils/decorators/auth-user.decorator';
import { now } from 'src/lib/utils/dates/date.utils';
import { PostSignInKakaoRes } from './dto/response/post.signin-kakao.res';
import { PostSignInKakaoReq } from './dto/request/post.signin-kakao.req';
import { Request, Response } from 'express';
import { PostSignOutRes } from './dto/response/post.signout.res';
import { PostAccessTokenRes } from './dto/response/post.access-token.res';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post({
        endPoint: '/email',
        summary: '이메일 중복 확인',
        type: PostEmailRes,
        status: HttpStatus.OK,
    })
    @ApiBody({ type: PostEmailReq })
    async checkDuplicateEmail(@Body() req: PostEmailReq): Promise<PostEmailRes> {
        return await this.authService.checkDuplicateEmail(req);
    }

    @Post({
        endPoint: '/nickname',
        summary: '닉네임 중복 확인',
        type: PostNicknameRes,
        status: HttpStatus.OK,
    })
    @ApiBody({ type: PostNicknameReq })
    async checkDuplicateNickname(@Body() req: PostNicknameReq): Promise<PostNicknameRes> {
        return await this.authService.checkDuplicateNickname(req);
    }

    @Post({
        endPoint: '/signup',
        summary: '회원가입',
        type: PostSignUpRes,
    })
    @ApiBody({ type: PostSignUpReq })
    async signUp(
        @Body() req: PostSignUpReq,
        @Res({ passthrough: true }) res: Response,
    ): Promise<PostSignUpRes> {
        const resDto = await this.authService.signUp(req);
        res.cookie('Refresh-Token', resDto.refreshToken, { httpOnly: true });
        return resDto;
    }

    @Post({
        endPoint: '/signin',
        summary: '로그인',
        type: PostSignInRes,
        status: HttpStatus.OK,
    })
    @ApiBody({ type: PostSignInReq })
    async signIn(
        @Body() req: PostSignInReq,
        @Res({ passthrough: true }) res: Response,
    ): Promise<PostSignInRes> {
        const resDto = await this.authService.signIn(req);
        res.cookie('Refresh-Token', resDto.refreshToken, { httpOnly: true });
        return resDto;
    }

    @Post({
        endPoint: '/signin-kakao',
        summary: '카카오로 시작하기',
        type: PostSignInKakaoRes,
        status: HttpStatus.OK,
    })
    @ApiBody({ type: PostSignInKakaoReq })
    async signInWithKakao(@Body() req: PostSignInKakaoReq): Promise<PostSignInKakaoRes> {
        return await this.authService.signInWithKakao(req);
    }

    @Post({
        endPoint: '/signout',
        summary: '로그아웃',
        type: PostSignOutRes,
        status: HttpStatus.OK,
    })
    @ApiSecurity('Authorization')
    async signOut(@AuthUser('userId') userId: number): Promise<PostSignOutRes> {
        return await this.authService.signOut(userId);
    }

    @Post({
        endPoint: '/access-token',
        summary: '액세스 토큰 재발급',
        type: PostAccessTokenRes,
    })
    @ApiSecurity('Authorization')
    async getAccessTokenWithRefreshToken(@Req() req: Request): Promise<PostAccessTokenRes> {
        const refreshToken = req?.cookies?.['Refresh-Token'];
        return await this.authService.getAccessTokenWithRefreshToken(refreshToken);
    }

    @Post({
        endPoint: '/breakout',
        summary: '회원탈퇴',
        type: PostBreakOutRes,
        status: HttpStatus.OK,
    })
    @ApiBody({ type: PostBreakOutReq })
    @ApiSecurity('Authorization')
    async breakOut(
        @AuthUser('userId') userId: number,
        @Body() req: PostBreakOutReq,
        date: Date = now(),
    ): Promise<PostBreakOutRes> {
        return await this.authService.breakOut(userId, req, date);
    }
}
