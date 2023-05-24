import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NotAuthenticatedException } from 'src/lib/exceptions/auth.exception';
import { UserEntity } from 'src/user/entities/user.entity';

export const AuthUser = createParamDecorator((data: keyof UserEntity, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new NotAuthenticatedException();
    return data ? user?.[data] : user;
});
