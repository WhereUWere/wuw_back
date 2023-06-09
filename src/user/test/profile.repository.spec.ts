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
});
