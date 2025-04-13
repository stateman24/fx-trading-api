/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { User } from '../src/users/users.entity';
import * as bcrypt from 'bcrypt';

describe('Auth E2E Testing', () => {
    let app: INestApplication;
    let datasource: DataSource;

    const email = `testing${Date.now()}@gmail.com`;
    const password = 'testingPassword';
    const repeatPassword = 'testingPassword';
    const firstName = 'testing';
    const lastName = 'testing2';

    beforeAll(async () => {
        const TestingFixure: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = TestingFixure.createNestApplication();
        datasource = TestingFixure.get<DataSource>(DataSource);
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should sign new user', async () => {
        const requestBody = {
            email: email,
            password: password,
            repeatPassword: repeatPassword,
            firstName: firstName,
            lastName: lastName,
        };
        const resMessage = 'Verification OTP sent to your email';
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send(requestBody)
            .expect(201);
        expect(res.body.message).toEqual(resMessage);
    });

    it('should verify OTP token', async () => {
        const userRepo = datasource.getRepository(User);
        const user = await userRepo.findOneByOrFail({ email: email });
        const resMessage = 'Email verified successfully';

        const otp = '000000'; // created a custom otp code
        user.emailOtp = await bcrypt.hash(otp, 10); // save otp to the database
        user.expireOtp = new Date(Date.now() + 600_000);
        console.log('set new otp token');
        await userRepo.save(user);

        const requestBody = {
            email: email,
            otpCode: '000000',
        };

        const res = await request(app.getHttpServer())
            .post('/auth/verify')
            .send(requestBody)
            .expect(201);

        expect(res.body.message).toEqual(resMessage);
    });

    it('should sign in the user', async () => {
        const requestBody = {
            email: email,
            password: password,
        };
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send(requestBody)
            .expect(201);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    });
});
