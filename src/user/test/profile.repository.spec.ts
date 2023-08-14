import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProfileRepository } from '../repository/profile.repository';
import { Profile as ProfileModel } from '@prisma/client';

describe('ProfileRepository', () => {
    let profileRepository: ProfileRepository;
    let prismaService: PrismaService;

    const mockedProfile: ProfileModel = {
        userId: 1,
        nickname: 'test',
        phoneNumber: null,
        birthOfDate: null,
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
                ProfileRepository,
                { provide: PrismaService, useValue: createMock<PrismaService>() },
            ],
        }).compile();

        profileRepository = module.get<ProfileRepository>(ProfileRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(profileRepository).toBeDefined();
    });

    describe('findUserIdByNickname', () => {
        it('findUserIdByNickname 이 정의되어 있다.', () => {
            expect(profileRepository.findUserIdByNickname).toBeDefined();
        });
        it('nickname 이 존재한다면, userId 를 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue({ userId: 1 });
            const result = await profileRepository.findUserIdByNickname('test');
            expect(result).toStrictEqual({ userId: 1 });
        });
        it('nickname 이 존재하지 않으면, null 을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue(null);
            const result = await profileRepository.findUserIdByNickname('test');
            expect(result).toBeNull();
        });
    });

    describe('findNicknameByUserId', () => {
        it('findNicknameByUserId 가 정의되어 있다.', () => {
            expect(profileRepository.findNicknameByUserId).toBeDefined();
        });
        it('userId 가 존재한다면, nickname 을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue({ nickname: 'test' });
            const result = await profileRepository.findNicknameByUserId(1);
            expect(result).toStrictEqual({ nickname: 'test' });
        });
        it('userId 가 존재하지 않으면, null 을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue(null);
            const result = await profileRepository.findNicknameByUserId(1);
            expect(result).toBeNull();
        });
    });

    describe('findOneByUserId', () => {
        it('findOneByUserId 가 정의되어 있다.', () => {
            expect(profileRepository.findOneByUserId).toBeDefined();
        });
        it('userId 가 존재한다면, profile 을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue(mockedProfile);
            const result = await profileRepository.findOneByUserId(1);
            expect(result).toBe(mockedProfile);
        });
        it('userId 가 존재하지 않으면, null 을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue(null);
            const result = await profileRepository.findOneByUserId(1);
            expect(result).toBeNull();
        });
    });

    describe('updateProfileByUserId', () => {
        it('updateProfileByUserId 가 정의되어 있다.', () => {
            expect(profileRepository.updateProfileByUserId).toBeDefined();
        });
        it('userId 에 해당하는 profile 을 수정하고, profile 을 리턴한다.', async () => {
            prismaService.profile.update = jest.fn().mockResolvedValue(updatedMockedProfile);
            const data = {
                nickname: 'test2',
                phoneNumber: '01012341234',
                birthOfDate: null,
                bio: 'bio test',
            };
            const result = await profileRepository.updateProfileByUserId(1, data);
            expect(result).toBe(updatedMockedProfile);
        });
    });

    describe('doesUserHaveAvatar', () => {
        it('doesUserHaveAvatar 가 정의되어 있다.', () => {
            expect(profileRepository.doesUserHaveAvatar).toBeDefined();
        });
        it('userId 에 해당하는 avatar 가 없다면, false 를 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue({ avatar: null });
            const result = await profileRepository.doesUserHaveAvatar(1);
            expect(result).toBe(false);
        });
        it('userId 에 해당하는 avatar 가 존재한다면, true 를 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue({ avatar: 'test.jpeg' });
            const result = await profileRepository.doesUserHaveAvatar(1);
            expect(result).toBe(true);
        });
    });

    describe('findAvatarByUserId', () => {
        it('findAvatarByUserId 가 정의되어 있다.', () => {
            expect(profileRepository.findAvatarByUserId).toBeDefined();
        });
        it('userId 에 해당하는 profile 이 없다면, null 을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue(null);
            const result = await profileRepository.findAvatarByUserId(1);
            expect(result).toBe(null);
        });
        it('userId 에 해당하는 avatar 가 없다면, { avatar: null } 을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue({ avatar: null });
            const result = await profileRepository.findAvatarByUserId(1);
            expect(result).toStrictEqual({ avatar: null });
        });
        it('userId 에 해당하는 avatar 가 존재한다면, 해당 값을 리턴한다.', async () => {
            prismaService.profile.findUnique = jest.fn().mockResolvedValue({ avatar: 'test.jpeg' });
            const result = await profileRepository.findAvatarByUserId(1);
            expect(result).toStrictEqual({ avatar: 'test.jpeg' });
        });
    });

    describe('updateAvatarByUserId', () => {
        it('updateAvatarByUserId 가 정의되어 있다.', () => {
            expect(profileRepository.updateAvatarByUserId).toBeDefined();
        });
        it('userId 에 해당하는 avatar 를 수정하고 리턴한다.', async () => {
            prismaService.profile.update = jest
                .fn()
                .mockResolvedValue({ ...mockedProfile, avatar: 'test.jpeg' });
            const result = await profileRepository.updateAvatarByUserId(1, 'test.jpeg');
            expect(result).toStrictEqual({ ...mockedProfile, avatar: 'test.jpeg' });
        });
    });

    describe('deleteAvatarByUserId', () => {
        it('deleteAvatarByUserId 가 정의되어 있다.', () => {
            expect(profileRepository.deleteAvatarByUserId).toBeDefined();
        });
        it('userId 에 해당하는 avatar 를 삭제하고 리턴한다.', async () => {
            prismaService.profile.update = jest
                .fn()
                .mockResolvedValue({ ...mockedProfile, avatar: null });
            const result = await profileRepository.deleteAvatarByUserId(1);
            expect(result).toStrictEqual({ ...mockedProfile, avatar: null });
        });
    });

    describe('softDelete', () => {
        it('softDelete 가 정의되어 있다.', () => {
            expect(profileRepository).toBeDefined();
        });
        it('profile 을 soft delete 하고 리턴한다.', async () => {
            const deletedAt = new Date('2023-05-07 15:36:00');
            const deletedProfile: ProfileModel = {
                userId: 1,
                nickname: '탈퇴한 유저1',
                phoneNumber: null,
                birthOfDate: null,
                avatar: null,
                bio: null,
                createdAt: new Date('2023-05-07 03:33:00'),
                updatedAt: new Date('2023-05-07 03:33:00'),
                deletedAt,
            };
            prismaService.profile.update = jest.fn().mockResolvedValue(deletedProfile);
            const result = await profileRepository.softDelete(1, deletedAt);
            expect(result).toStrictEqual(deletedProfile);
        });
    });
});
