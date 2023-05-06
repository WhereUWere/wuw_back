import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserRepository } from '../repository/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { auth } from 'src/config/authConfig';

describe('UserRepository', async () => {
    let userRepository: UserRepository;
    let prismaService: PrismaService;

    const encryptedPassword = await bcrypt.hash('password', auth.hashSalt);
    const mockedUser = {
        userId: 1,
        email: 'abcdefg@test.com',
        nickname: 'test',
        password: encryptedPassword,
        role: Role.USER,
        registeredAt: new Date('2023-05-07 03:33:00'),
        updatedAt: new Date('2023-05-07 03:33:00'),
        deletedAt: null,
    };

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
            const result = await userRepository.findUserIdByEmail('abcdefg@test.com');
            expect(result?.userId).toBe(1);
            expect(result).toStrictEqual({ userId: 1 });
        });
        it('email 이 존재하지 않으면, null 을 리턴한다.', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
            const result = await userRepository.findUserIdByEmail('abcdefg@test.com');
            expect(result).toBeNull();
        });
    });

    describe('createAndSave', () => {
        it('createAndSave 가 정의되어 있다.', () => {
            expect(userRepository.createAndSave).toBeDefined();
        });
        it('생성된 user 를 리턴한다.', async () => {
            prismaService.user.create = jest.fn().mockResolvedValue(mockedUser);
            const result = await userRepository.createAndSave(
                'abcdefg@test.com',
                'test',
                'password',
            );
            expect(result).toStrictEqual(mockedUser);
        });
    });

    describe('findUserByEmail', () => {
        it('findUserByEmail 이 정의되어 있다.', () => {
            expect(userRepository.findUserByEmail).toBeDefined();
        });
        it('email 이 존재한다면, user 를 리턴한다.', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(mockedUser);
            const result = await userRepository.findUserByEmail('abcdefg@test.com');
            expect(result).toStrictEqual(mockedUser);
        });
        it('email 이 존재하지 않으면, null 을 리턴한다.', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
            const result = await userRepository.findUserByEmail('abcdefg@test.com');
            expect(result).toBeNull();
        });
    });
});
