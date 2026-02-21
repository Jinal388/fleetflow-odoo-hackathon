import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: string;
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
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=user.model.d.ts.map