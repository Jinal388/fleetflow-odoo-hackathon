import { Request, Response, NextFunction } from 'express';
import { JwtUtility } from '../utils/jwt.utility';
import { ApiResponse } from '../utils/api.response.utility';
import { User } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return ApiResponse.unauthorized(res, 'No token provided');
    }

    const decoded = JwtUtility.verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return ApiResponse.unauthorized(res, 'Invalid token or user inactive');
    }

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Invalid or expired token');
  }
};
