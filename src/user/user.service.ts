import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { ProfileRepository } from './repository/profile.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly profileRepository: ProfileRepository,
    ) {}
}
