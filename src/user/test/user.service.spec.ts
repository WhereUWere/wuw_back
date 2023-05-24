import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../repository/user.repository';
import { ProfileRepository } from '../repository/profile.repository';
import { createMock } from '@golevelup/ts-jest';
import { Profile as ProfileModel } from '@prisma/client';
import { GetProfileRes } from '../dto/response/get.profile.res';
import { PatchProfileReq } from '../dto/request/patch.profile.req';
import { PatchProfileRes } from '../dto/response/patch.profile.res';
import { ProfileNotFoundException } from 'src/lib/exceptions/profile.exception';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;
    let profileRepository: ProfileRepository;

    const mockedProfile: ProfileModel = {
        userId: 1,
        nickname: 'test',
        phoneNumber: '01012341234',
        birthOfDate: '19970101',
        avatar: null,
        bio: null,
        createdAt: new Date('2023-05-07 03:33:00'),
        updatedAt: new Date('2023-05-07 03:33:00'),
        deletedAt: null,
    };
    const updatedMockedProfile = {
        userId: 1,
        nickname: 'test2',
        phoneNumber: '01012341234',
        birthOfDate: null,
        avatar: null,
        bio: 'bio test',
        createdAt: new Date('2023-05-07 03:33:00'),
        updatedAt: new Date('2023-05-24 17:28:00'),
        deletedAt: null,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserRepository, useValue: createMock<UserRepository>() },
                { provide: ProfileRepository, useValue: createMock<ProfileRepository>() },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>(UserRepository);
        profileRepository = module.get<ProfileRepository>(ProfileRepository);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('getProfile', () => {
        it('getProfile 이 정의되어 있다.', () => {
            expect(userService.getProfile).toBeDefined();
        });
        it('profile 이 존재하지 않을 경우, ProfileNotFoundException 발생', async () => {
            profileRepository.findOneByUserId = jest.fn().mockResolvedValue(null);
            const result = async () => await userService.getProfile(1);
            await expect(result).rejects.toThrowError(new ProfileNotFoundException());
        });
        it('profile 이 존재할 경우, profile 을 리턴한다.', async () => {
            profileRepository.findOneByUserId = jest.fn().mockResolvedValue(mockedProfile);
            const resDto = new GetProfileRes(
                mockedProfile.nickname,
                mockedProfile.phoneNumber,
                mockedProfile.birthOfDate,
                mockedProfile.bio,
            );
            const result = await userService.getProfile(1);
            expect(result).toStrictEqual(resDto);
        });
    });

    describe('updateProfile', () => {
        it('updateProfile 이 정의되어 있다.', () => {
            expect(userService.updateProfile).toBeDefined();
        });
        it('profile 이 존재하지 않을 경우, ProfileNotFoundException 발생', async () => {
            const reqDto = new PatchProfileReq('test2', '01012341234', null, null);
            profileRepository.findNicknameByUserId = jest.fn().mockResolvedValue(null);
            const result = async () => await userService.updateProfile(1, reqDto);
            await expect(result).rejects.toThrowError(new ProfileNotFoundException());
        });
        it('profile 이 존재할 경우, 수정된 profile 을 리턴한다.', async () => {
            const reqDto = new PatchProfileReq('test2', '01012341234', null, 'bio test');
            const resDto = new PatchProfileRes(
                updatedMockedProfile.nickname,
                updatedMockedProfile.phoneNumber,
                updatedMockedProfile.birthOfDate,
                updatedMockedProfile.bio,
            );
            profileRepository.findNicknameByUserId = jest
                .fn()
                .mockResolvedValue({ nickname: 'test' });
            profileRepository.updateProfileByUserId = jest
                .fn()
                .mockResolvedValue(updatedMockedProfile);
            const result = await userService.updateProfile(1, reqDto);
            expect(result).toStrictEqual(resDto);
        });
    });
});
