import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserRepository } from '../repository/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { now } from 'src/lib/utils/dates/date.utils';

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let prismaService: PrismaService;
    const email = 'abcdefg@test.com';
    const nickname = 'test';
    const password = 'password';

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
            prismaService.user.findUnique = jest.fn().mockResolvedValue({ userId: 1 });
            const result = await userRepository.findUserIdByEmail(email);
            expect(result?.userId).toBe(1);
            expect(result).toStrictEqual({ userId: 1 });
        });
        it('email 이 존재하지 않으면, null 을 리턴한다.', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
            const result = await userRepository.findUserIdByEmail(email);
            expect(result).toBeNull();
        });
    });
    describe('createAndSave', () => {
        const mockedUser = {
            userId: 1,
            email,
            nickname,
            password,
            role: Role.USER,
            registeredAt: now(),
            updatedAt: now(),
            deletedAt: null,
        };
        it('createAndSave 가 정의되어 있다.', () => {
            expect(userRepository.createAndSave).toBeDefined();
        });
        it('생성된 user 를 리턴한다.', async () => {
            prismaService.user.create = jest.fn().mockResolvedValue(mockedUser);
            const result = await userRepository.createAndSave(email, nickname, password);
            expect(result).toStrictEqual(mockedUser);
            expect(result.email).toStrictEqual(email);
            expect(result.password).toStrictEqual(password);
        });
    });
});
