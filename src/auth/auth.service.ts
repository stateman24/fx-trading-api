/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { generateOtp } from 'src/utils/otpGenerator.utils';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { MailService } from 'src/mail/mail.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
        private mailSevice: MailService,
        private walletService: WalletService,
    ) {}

    async register(createUserDto: CreateUserDto) {
        if (createUserDto.password !== createUserDto.repeatPassword) {
            throw new HttpException(
                'Password does not match',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        const passwordHash = await bcrypt.hash(createUserDto.password, 10);
        const otp = generateOtp();
        const hashOtp = await bcrypt.hash(otp, 10);
        const exprieOtpTime = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

        const newUser = this.userRepo.create({
            email: createUserDto.email,
            password: passwordHash,
            firstName: createUserDto.firstName,
            lastName: createUserDto.firstName,
            emailOtp: hashOtp,
            expireOtp: exprieOtpTime,
        });
        await this.mailSevice.sendOtp(newUser.email, otp); // send OTP to the new user
        await this.userRepo.save(newUser);
        console.log(`OTP for ${newUser.email}: ${otp}`);
        return { message: 'Verfication OTP sent to your email' };
    }

    async login(lognUserdto: LoginUserDto) {
        const user = await this.userRepo.findOneBy({
            email: lognUserdto.email,
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(
            lognUserdto.password,
            user.password,
        );
        if (!isMatch) {
            throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
        }
        if (!user.isActive) {
            throw new UnauthorizedException(
                'Please verify emaail to activte account',
            );
        }
        return this.generateToken(user);
    }
    private generateToken(user: User) {
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        return { user, accessToken, refreshToken };
    }

    async validateUser(userId: string) {
        return this.userRepo.findOne({ where: { id: userId } });
    }

    async verifyEmailOtp(emailDto: VerifyEmailDto) {
        const user = await this.userRepo.findOne({
            where: { email: emailDto.email },
        });
        if (!user) {
            throw new NotFoundException('User Not Found');
        }
        const isOtpValid = await bcrypt.compare(
            emailDto.otpCode,
            user.emailOtp,
        );
        if (!isOtpValid) {
            throw new UnauthorizedException('Invalid OTP');
        }
        if (!user.expireOtp || user.expireOtp < new Date()) {
            throw new UnauthorizedException('OTP Expried');
        }

        user.isActive = true;
        user.emailOtp = null;
        user.expireOtp = null;

        await this.userRepo.save(user);
        await this.walletService.createDefaultWallets(user);
        return { message: 'Email verified successfully' };
    }

    async resendOtp(emailData) {
        const user = await this.userRepo.findOneBy({ email: emailData.email });
        if (!user) throw new NotFoundException('User not found');

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        user.emailOtp = hashedOtp;
        user.expireOtp = new Date(Date.now() + 5 * 60 * 1000);
        await this.userRepo.save(user);

        await this.mailSevice.sendOtp(user.email, otp);
        return { message: 'New OTP sent' };
    }
}
