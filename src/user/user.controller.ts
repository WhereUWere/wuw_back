import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Get, Patch, Post } from 'src/lib/utils/decorators/http-method.decorator';
import { GetProfileRes } from './dto/response/get.profile.res';
import { AuthUser } from 'src/lib/utils/decorators/auth-user.decorator';
import { PatchProfileReq } from './dto/request/patch.profile.req';
import { PatchProfileRes } from './dto/response/patch.profile.res';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get({ endPoint: 'profile', summary: '프로필 조회', type: GetProfileRes })
    @ApiSecurity('Authorization')
    async getProfile(@AuthUser('userId') userId: number): Promise<GetProfileRes> {
        return await this.userService.getProfile(userId);
    }

    @Patch({ endPoint: 'profile', summary: '프로필 수정', type: PatchProfileRes })
    @ApiBody({ type: PatchProfileReq })
    @ApiSecurity('Authorization')
    async updateProfile(
        @AuthUser('userId') userId: number,
        @Body() req: PatchProfileReq,
    ): Promise<PatchProfileRes> {
        return await this.userService.updateProfile(userId, req);
    }
}
