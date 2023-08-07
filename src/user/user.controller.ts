import { Body, Controller, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Delete, Get, Patch, Post } from 'src/lib/utils/decorators/http-method.decorator';
import { GetProfileRes } from './dto/response/get.profile.res';
import { AuthUser } from 'src/lib/utils/decorators/auth-user.decorator';
import { PatchProfileReq } from './dto/request/patch.profile.req';
import { PatchProfileRes } from './dto/response/patch.profile.res';
import { PostAvatarRes } from './dto/response/post.avatar.res';
import { ApiUploadFile } from 'src/lib/utils/decorators/api-upload-file.decorator';
import { ImageService } from 'src/image/image.service';
import { DeleteAvatarRes } from './dto/response/delete.avatar.res';
import { GetAvatarRes } from './dto/response/get.avatar.res';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly imageService: ImageService,
    ) {}

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

    @Get({ endPoint: 'avatar', summary: '아바타 이미지 조회', type: GetAvatarRes })
    @ApiSecurity('Authorization')
    async getAvatar(@AuthUser('userId') userId: number): Promise<GetAvatarRes> {
        return await this.imageService.getAvatar(userId);
    }

    @Post({ endPoint: 'avatar', summary: '아바타 이미지 업로드', type: PostAvatarRes })
    @ApiUploadFile('image')
    @ApiSecurity('Authorization')
    async uploadAvatar(
        @AuthUser('userId') userId: number,
        @UploadedFile() image: Express.Multer.File,
    ): Promise<PostAvatarRes> {
        return await this.imageService.uploadAvatar(userId, image);
    }

    @Delete({ endPoint: 'avatar', summary: '아바타 이미지 제거', type: DeleteAvatarRes })
    @ApiSecurity('Authorization')
    async deleteAvatar(@AuthUser('userId') userId: number): Promise<DeleteAvatarRes> {
        return await this.imageService.deleteAvatar(userId);
    }
}
