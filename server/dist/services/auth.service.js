"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../models/user.model");
const jwt_utility_1 = require("../utils/jwt.utility");
const email_utility_1 = require("../utils/email.utility");
const constants_1 = require("../config/constants");
class AuthService {
    static async register(email, password, name, role, requestingUserRole) {
        // Check for existing user
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        // CRITICAL: Prevent admin creation via API
        if (role === constants_1.ROLES.ADMIN) {
            throw new Error('Admin accounts can only be created via database seeding');
        }
        // Role validation: Only admin can create manager
        if (role === constants_1.ROLES.MANAGER && requestingUserRole !== constants_1.ROLES.ADMIN) {
            throw new Error('Only admin can create manager accounts');
        }
        // Create user
        const user = await user_model_1.User.create({
            email,
            password,
            name,
            role: role || constants_1.ROLES.DISPATCHER,
            isVerified: false,
        });
        // Generate OTP
        const otp = user.generateOTP();
        user.verificationOTP = otp;
        user.verificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
        // Send verification email
        await email_utility_1.EmailUtility.sendVerificationOTP(email, otp, name);
        // Remove sensitive fields
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.verificationOTP;
        delete userObject.verificationOTPExpiry;
        return {
            user: userObject,
            message: 'Registration successful. Please verify your email with the OTP sent.',
        };
    }
    static async verifyEmail(email, otp) {
        const user = await user_model_1.User.findOne({ email }).select('+verificationOTP +verificationOTPExpiry +password');
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isVerified) {
            throw new Error('Email already verified');
        }
        if (!user.isOTPValid(otp, 'verification')) {
            throw new Error('Invalid or expired OTP');
        }
        // Verify user
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpiry = undefined;
        await user.save();
        // Generate token
        const token = jwt_utility_1.JwtUtility.generateToken({ userId: user._id.toString(), role: user.role });
        // Remove sensitive fields
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.verificationOTP;
        delete userObject.verificationOTPExpiry;
        return { user: userObject, token };
    }
    static async login(email, password) {
        const user = await user_model_1.User.findOne({ email }).select('+password');
        if (!user || !user.isActive) {
            throw new Error('Invalid credentials');
        }
        if (!user.isVerified) {
            throw new Error('Please verify your email before logging in');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const token = jwt_utility_1.JwtUtility.generateToken({ userId: user._id.toString(), role: user.role });
        // Remove sensitive fields
        const userObject = user.toObject();
        delete userObject.password;
        return { user: userObject, token };
    }
    static async forgotPassword(email) {
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            return { message: 'If the email exists, a reset code has been sent' };
        }
        // Generate reset OTP
        const otp = user.generateOTP();
        user.resetOTP = otp;
        user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
        // Send reset email
        await email_utility_1.EmailUtility.sendResetOTP(email, otp, user.name);
        return { message: 'If the email exists, a reset code has been sent' };
    }
    static async resetPassword(email, otp, newPassword) {
        const user = await user_model_1.User.findOne({ email }).select('+resetOTP +resetOTPExpiry +password');
        if (!user) {
            throw new Error('Invalid request');
        }
        if (!user.isOTPValid(otp, 'reset')) {
            throw new Error('Invalid or expired OTP');
        }
        // Reset password
        user.password = newPassword;
        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;
        await user.save();
        return { message: 'Password reset successful' };
    }
    static async resendVerificationOTP(email) {
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isVerified) {
            throw new Error('Email already verified');
        }
        // Generate new OTP
        const otp = user.generateOTP();
        user.verificationOTP = otp;
        user.verificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        // Send verification email
        await email_utility_1.EmailUtility.sendVerificationOTP(email, otp, user.name);
        return { message: 'Verification OTP resent successfully' };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map