/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/users.entity';

describe('Wallet E2E testing', () => {
    let app: INestApplication;
    let datasource: DataSource;
    let jwtToken: string;

    beforeAll(async () => {
        const testingFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = testingFixture.createNestApplication();
        datasource = testingFixture.get<DataSource>(DataSource);
        await app.init();

        const email = `testing${Date.now()}@gmail.com`;
        const password = 'testingPassword';
        const repeatPassword = 'testingPassword';
        const firstName = 'testing';
        const lastName = 'testing2';

        //  register new user
        const registerData = {
            email: email,
            password: password,
            repeatPassword: repeatPassword,
            firstName: firstName,
            lastName: lastName,
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerData)
            .expect(201);

        // verify user email
        const userRepo = datasource.getRepository(User);
        const user = await userRepo.findOneByOrFail({ email: email });

        const otp = '123456';
        user.emailOtp = await bcrypt.hash(otp, 10);
        user.expireOtp = new Date(Date.now() + 1000 * 10 * 60); // 10 minute expiration time
        await userRepo.save(user);

        const verifyEmailData = {
            email: email,
            otpCode: '123456',
        };

        await request(app.getHttpServer())
            .post('/auth/verify')
            .send(verifyEmailData)
            .expect(201);

        // signin User
        const loginData = {
            email: email,
            password: password,
        };

        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginData)
            .expect(201);

        jwtToken = res.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    it('should get user wallet', async () => {
        const res = await request(app.getHttpServer())
            .get('/wallet')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);
        const wallets = res.body;
        expect(Array.isArray(wallets)).toBe(true);
        expect(wallets.length).toBe(3);
        const ngnWallet = wallets.find((wallet) => wallet.currency === 'NGN');

        expect(ngnWallet).toBeDefined();
        expect(ngnWallet.balance).toBe('100.00');
    });

    it('should fund user wallet', async () => {
        const fundData = {
            amount: 1000,
            currency: 'NGN',
        };
        const resMessage = { message: 'Wallet funded successfully' };

        const res = await request(app.getHttpServer())
            .post('/wallet/fund')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(fundData)
            .expect(201);
        expect(res.body).toEqual(resMessage);
    });

    it('should convert from one wallet to another', async () => {
        const conversionData = {
            sourceCurrency: 'NGN',
            targetCurrency: 'USD',
            amount: 1000,
        };
        const resMessage = { message: 'Funds converted successfully' };
        const res = await request(app.getHttpServer())
            .post('/wallet/convert')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(conversionData)
            .expect(201);
        expect(res.body).toEqual(resMessage);
    });
});
