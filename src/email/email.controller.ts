import { Body, Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { Post } from 'src/lib/utils/decorators/http-method.decorator';
import { PostSendEmailRes } from './dto/response/post.send-email.res';
import { PostSendEmailReq } from './dto/request/post.send-email.req';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('email')
@ApiTags('Email API')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post({ endPoint: 'test', summary: '테스트 이메일 발송', type: PostSendEmailRes })
    @ApiBody({ type: PostSendEmailReq })
    async sendTestEmail(@Body() req: PostSendEmailReq): Promise<PostSendEmailRes> {
        return await this.emailService.sendVerificationEmail(req.to, req.subject, req.content);
    }
}
