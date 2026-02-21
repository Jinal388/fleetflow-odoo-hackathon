import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class AuthController {
    static register(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static verifyEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static resendVerificationOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map