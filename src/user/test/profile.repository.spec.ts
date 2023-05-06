import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProfileRepository } from '../repository/profile.repository';

describe('ProfileRepository', () => {
    let profileRepository: ProfileRepository;
    let prismaService: PrismaService;

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
        it('findNicknameByUserId 이 정의되어 있다.', () => {
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
});
