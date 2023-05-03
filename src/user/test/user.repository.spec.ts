import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserRepository } from '../repository/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                { provide: PrismaService, useValue: createMock<PrismaService>() },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(userRepository).toBeDefined();
    });
    describe('findUserIdByEmail', () => {
        it('findUserIdByEmail 이 정의되어 있다.', () => {
            expect(userRepository.findUserIdByEmail).toBeDefined();
        });
        it('email 이 존재한다면, userId 를 리턴한다.', async () => {
            const email = 'abcdefg@test.com';
            const resDto = { userId: 1 };
            prismaService.user.findUnique = jest.fn().mockResolvedValue({ userId: 1 });
            const response = await userRepository.findUserIdByEmail(email);
            expect(response?.userId).toBe(1);
            expect(response).toStrictEqual(resDto);
        });
        it('email 이 존재하지 않으면, null 을 리턴한다.', async () => {
            const email = 'abcdefg@test.com';
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
            const response = await userRepository.findUserIdByEmail(email);
            expect(response).toBeNull();
        });
    });
});
