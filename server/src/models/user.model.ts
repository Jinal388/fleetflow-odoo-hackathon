import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: typeof ROLES[keyof typeof ROLES];
  isActive: boolean;
  isVerified: boolean;
  verificationOTP?: string;
  verificationOTPExpiry?: Date;
  resetOTP?: string;
  resetOTPExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateOTP(): string;
  isOTPValid(otp: string, type: 'verification' | 'reset'): boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: Object.values(ROLES), required: true, default: ROLES.DISPATCHER },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String, select: false },
    verificationOTPExpiry: { type: Date, select: false },
    resetOTP: { type: String, select: false },
    resetOTPExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateOTP = function (): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

userSchema.methods.isOTPValid = function (otp: string, type: 'verification' | 'reset'): boolean {
  const otpField = type === 'verification' ? this.verificationOTP : this.resetOTP;
  const expiryField = type === 'verification' ? this.verificationOTPExpiry : this.resetOTPExpiry;
  
  if (!otpField || !expiryField) return false;
  if (otpField !== otp) return false;
  if (new Date() > expiryField) return false;
  
  return true;
};

export const User = mongoose.model<IUser>('User', userSchema);
