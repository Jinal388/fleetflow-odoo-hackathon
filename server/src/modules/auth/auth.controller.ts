import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      const requestingUserRole = req.user?.role;
      
      const result = await AuthService.register(email, password, name, role, requestingUserRole);
      return ApiResponse.created(res, result.user, result.message);
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyEmail(email, otp);
      return ApiResponse.success(res, result, 'Email verified successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error: any) {
      return ApiResponse.unauthorized(res, error.message);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await AuthService.resetPassword(email, otp, newPassword);
      return ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async resendVerificationOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendVerificationOTP(email);
      return ApiResponse.success(res, null, result.message);
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }
}
