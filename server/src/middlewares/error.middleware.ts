import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api.response.utility';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return ApiResponse.badRequest(res, 'Validation error', err.errors);
  }

  if (err.name === 'CastError') {
    return ApiResponse.badRequest(res, 'Invalid ID format');
  }

  if (err.code === 11000) {
    return ApiResponse.conflict(res, 'Duplicate entry', err.keyValue);
  }

  return ApiResponse.error(res, err.message || 'Internal server error', err.statusCode || 500);
};
