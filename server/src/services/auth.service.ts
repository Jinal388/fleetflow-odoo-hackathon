import { User, IUser } from '../models/user.model';
import { JwtUtility } from '../utils/jwt.utility';
import { EmailUtility } from '../utils/email.utility';
import { ROLES } from '../config/constants';

export class AuthService {
  static async register(
    email: string,
    password: string,
    name: string,
    role: string,
    requestingUserRole?: string
  ): Promise<{ user: IUser; message: string }> {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // CRITICAL: Prevent admin creation via API
    if (role === ROLES.ADMIN) {
      throw new Error('Admin accounts can only be created via database seeding');
    }

    // Role validation: Only admin can create manager
    if (role === ROLES.MANAGER && requestingUserRole !== ROLES.ADMIN) {
      throw new Error('Only admin can create manager accounts');
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role: role || ROLES.DISPATCHER,
      isVerified: false,
    });

    // Generate OTP
    const otp = user.generateOTP();
    user.verificationOTP = otp;
    user.verificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send verification email
    await EmailUtility.sendVerificationOTP(email, otp, name);

    // Remove sensitive fields
    const userObject: any = user.toObject();
    delete userObject.password;
    delete userObject.verificationOTP;
    delete userObject.verificationOTPExpiry;

    return {
      user: userObject as IUser,
      message: 'Registration successful. Please verify your email with the OTP sent.',
    };
  }

  static async verifyEmail(email: string, otp: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email }).select('+verificationOTP +verificationOTPExpiry +password');
    
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
    const token = JwtUtility.generateToken({ userId: user._id.toString(), role: user.role });

    // Remove sensitive fields
    const userObject: any = user.toObject();
    delete userObject.password;
    delete userObject.verificationOTP;
    delete userObject.verificationOTPExpiry;

    return { user: userObject as IUser, token };
  }

  static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email }).select('+password');
    
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

    const token = JwtUtility.generateToken({ userId: user._id.toString(), role: user.role });

    // Remove sensitive fields
    const userObject: any = user.toObject();
    delete userObject.password;

    return { user: userObject as IUser, token };
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email });
    
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
    await EmailUtility.sendResetOTP(email, otp, user.name);

    return { message: 'If the email exists, a reset code has been sent' };
  }

  static async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    const user = await User.findOne({ email }).select('+resetOTP +resetOTPExpiry +password');
    
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

  static async resendVerificationOTP(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email });
    
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
    await EmailUtility.sendVerificationOTP(email, otp, user.name);

    return { message: 'Verification OTP resent successfully' };
  }
}
