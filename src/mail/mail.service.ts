// src/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendOtp(to: string, otp: string): Promise<void> {
        try {
            const mailOptions = {
                from: `"FX API" <${process.env.MAIL_USER}>`,
                to,
                subject: 'Verify Your Email - OTP',
                html: `
          <h3>Your OTP Code</h3>
          <p>Use this code to verify your email: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `,
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email send error:', error);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}
