import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { PostEmailReq } from '../dto/request/post.email.req';
import { PostEmailRes } from '../dto/response/post.email.res';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserRepository, useValue: createMock<UserRepository>() },
                { provide: PrismaService, useValue: createMock<PrismaService>() },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('checkDuplicateEmail', () => {
        it('checkDuplicateEmail 이 정의되어 있다.', () => {
            expect(authService.checkDuplicateEmail).toBeDefined();
        });
        it('이메일이 존재할 경우, true 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@gmail.com');
            const resDto = new PostEmailRes(true);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue({ userId: 1 });
            expect(await authService.checkDuplicateEmail(reqDto)).toStrictEqual(resDto);
        });
        it('이메일이 존재하지 않을 경우, false 를 리턴한다.', async () => {
            const reqDto = new PostEmailReq('abcdefg@gmail.com');
            const resDto = new PostEmailRes(false);
            userRepository.findUserIdByEmail = jest.fn().mockResolvedValue(null);
            expect(await authService.checkDuplicateEmail(reqDto)).toStrictEqual(resDto);
        });
    });
});
