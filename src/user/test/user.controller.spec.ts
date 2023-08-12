import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { PatchProfileReq } from '../dto/request/patch.profile.req';
import { PatchProfileRes } from '../dto/response/patch.profile.res';
import { GetProfileRes } from '../dto/response/get.profile.res';
import { ImageService } from 'src/image/image.service';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;
    let imageService: ImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: createMock<UserService>() },
                { provide: ImageService, useValue: createMock<ImageService>() },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
        imageService = module.get<ImageService>(ImageService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    describe('getProfile', () => {
        it('getProfile 이 정의되어 있다.', () => {
            expect(userController.getProfile).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const resDto = new GetProfileRes('test', '01012341234', null, null);
            userService.getProfile = jest.fn().mockResolvedValue(resDto);
            const result = await userController.getProfile(1);
            expect(result).toBe(resDto);
        });
    });

    describe('updateProfile', () => {
        it('updateProfile 이 정의되어 있다.', () => {
            expect(userController.updateProfile).toBeDefined();
        });
        it('Service 의 반환값을 리턴한다.', async () => {
            const reqDto = new PatchProfileReq('test', '01012341234', '19970101', null);
            const resDto = new PatchProfileRes('test', '01012341234', '19970101', null);
            userService.updateProfile = jest.fn().mockResolvedValue(resDto);
            const result = await userController.updateProfile(1, reqDto);
            expect(result).toBe(resDto);
        });
    });
});
