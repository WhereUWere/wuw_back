import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserRepository } from '../repository/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role, User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { auth } from 'src/config/authConfig';

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let prismaService: PrismaService;

    const encryptedPassword = bcrypt.hashSync('password', auth.hashSalt);
    const mockedUser: UserModel = {
        userId: 1,
        email: 'abcdefg@test.com',
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
            expect(result).toStrictEqual({ userId: 1 });
        });
        it('email 이 존재하지 않으면, null 을 리턴한다.', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
            const result = await userRepository.findUserIdByEmail('abcdefg@test.com');
            expect(result).toBeNull();
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

    describe('findUserByUserId', () => {
        it('findUserByUserId 가 정의되어 있다.', () => {
            expect(userRepository.findUserByUserId).toBeDefined();
        });
        it('userId 가 존재한다면, user 를 리턴한다.', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(mockedUser);
            const result = await userRepository.findUserByUserId(1);
            expect(result).toStrictEqual(mockedUser);
        });
        it('userId 가 존재하지 않는다면, null 을 리턴한다.', async () => {
            prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
            const result = await userRepository.findUserByUserId(1);
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

    describe('softDelete', () => {
        it('softDelete 가 정의되어 있다.', () => {
            expect(userRepository.softDelete).toBeDefined();
        });
        it('user 의 deletedAt 에 날짜를 추가하여 리턴한다.', async () => {
            const deletedAt = new Date('2023-05-07 15:36:00');
            const mockedUserDelete = Object.assign({}, mockedUser);
            mockedUserDelete.deletedAt = deletedAt;
            prismaService.user.update = jest.fn().mockResolvedValue(mockedUserDelete);
            const result = await userRepository.softDelete(1, deletedAt);
            expect(result).toStrictEqual(mockedUserDelete);
        });
    });
});
