/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { WalletService } from '../wallet/wallet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Wallet } from '../wallet/wallet.entitiy';

describe('AuthController', () => {
    let controller: AuthController;

    const mockUserRepo = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockWalletRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockDataSource = {
        transaction: jest
            .fn()
            .mockImplementation((cb) => cb({ save: jest.fn() })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                JwtService,
                MailService,
                WalletService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo,
                },
                {
                    provide: getRepositoryToken(Wallet),
                    useValue: mockWalletRepository,
                },
                {
                    provide: 'DataSource',
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    // actual testin for register route
    describe('register', () => {
        it('should return a message', () => {
            const data = {
                email: 'example@gmail.com',
                password: 'examplepass',
                repeatPassword: 'examplepass',
                firstName: 'first',
                lastName: 'last',
            };
            const message = { message: 'Verification OTP sent to your email' };
            expect(controller.register(data)).toBe(message);
        });
    });
});
