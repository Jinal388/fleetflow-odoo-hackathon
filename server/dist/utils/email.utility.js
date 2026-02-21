"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailUtility = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class EmailUtility {
    static async sendVerificationOTP(email, otp, name) {
        const mailOptions = {
            from: `"FleetFlow" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: 'Verify Your FleetFlow Account',
            html: `
        <h2>Welcome to FleetFlow, ${name}!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Email send error:', error);
            // In development, log OTP to console
            if (process.env.NODE_ENV === 'development') {
                console.log(`📧 Verification OTP for ${email}: ${otp}`);
            }
        }
    }
    static async sendResetOTP(email, otp, name) {
        const mailOptions = {
            from: `"FleetFlow" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: 'Reset Your FleetFlow Password',
            html: `
        <h2>Hello ${name},</h2>
        <p>You requested to reset your password. Your reset code is:</p>
        <h1 style="color: #FF5722; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Email send error:', error);
            // In development, log OTP to console
            if (process.env.NODE_ENV === 'development') {
                console.log(`📧 Reset OTP for ${email}: ${otp}`);
            }
        }
    }
}
exports.EmailUtility = EmailUtility;
EmailUtility.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
//# sourceMappingURL=email.utility.js.map