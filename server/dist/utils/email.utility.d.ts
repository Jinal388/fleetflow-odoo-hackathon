export declare class EmailUtility {
    private static transporter;
    static sendVerificationOTP(email: string, otp: string, name: string): Promise<void>;
    static sendResetOTP(email: string, otp: string, name: string): Promise<void>;
}
//# sourceMappingURL=email.utility.d.ts.map