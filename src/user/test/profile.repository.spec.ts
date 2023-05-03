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
            const nickname = 'test';
            const resDto = { userId: 1 };
            prismaService.profile.findUnique = jest.fn().mockResolvedValue({ userId: 1 });
            const response = await profileRepository.findUserIdByNickname(nickname);
            expect(response?.userId).toBe(1);
            expect(response).toStrictEqual(resDto);
        });
        it('nickname 이 존재하지 않으면, null 을 리턴한다.', async () => {
            const nickname = 'test';
            prismaService.profile.findUnique = jest.fn().mockResolvedValue(null);
            const response = await profileRepository.findUserIdByNickname(nickname);
            expect(response).toBeNull();
        });
    });
});
