interface TokenPayload {
    userId: string;
    role: string;
}
export declare class JwtUtility {
    private static secret;
    private static expiresIn;
    static generateToken(payload: TokenPayload): string;
    static verifyToken(token: string): TokenPayload;
}
export {};
//# sourceMappingURL=jwt.utility.d.ts.map