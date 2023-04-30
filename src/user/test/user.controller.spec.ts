import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserRepository } from '../repository/user.repository';
import { ProfileRepository } from '../repository/profile.repository';
import { PrismaService } from '../../../prisma/prisma.service';

describe('UsersController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: createMock<UserService>(),
                },
                {
                    provide: UserRepository,
                    useValue: createMock<UserRepository>(),
                },
                {
                    provide: ProfileRepository,
                    useValue: createMock<ProfileRepository>(),
                },
                {
                    provide: PrismaService,
                    useValue: createMock<PrismaService>(),
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });
});
