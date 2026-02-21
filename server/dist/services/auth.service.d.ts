import { IUser } from '../models/user.model';
export declare class AuthService {
    static register(email: string, password: string, name: string, role: string, requestingUserRole?: string): Promise<{
        user: IUser;
        message: string;
    }>;
    static verifyEmail(email: string, otp: string): Promise<{
        user: IUser;
        token: string;
    }>;
    static login(email: string, password: string): Promise<{
        user: IUser;
        token: string;
    }>;
    static forgotPassword(email: string): Promise<{
        message: string;
    }>;
    static resetPassword(email: string, otp: string, newPassword: string): Promise<{
        message: string;
    }>;
    static resendVerificationOTP(email: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map