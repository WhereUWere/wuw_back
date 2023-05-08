import { Request } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';

export interface IUserInfoRequest extends Request {
    user: UserEntity;
}
