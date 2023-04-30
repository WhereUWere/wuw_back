import { Body, Controller, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Post } from 'src/lib/utils/decorators/http-method.decorator';
import { PostEmailRes } from './dto/response/post.email.res';
import { PostEmailReq } from './dto/request/post.email.req';

@Controller('auth')
@ApiTags('Auth')
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
}
