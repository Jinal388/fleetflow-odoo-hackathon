import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { ROLES } from '../../config/constants';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').optional().isIn([ROLES.MANAGER, ROLES.DISPATCHER]).withMessage('Invalid role. Only manager and dispatcher roles can be registered via API'),
    validate,
  ],
  AuthController.register
);

router.post(
  '/verify-email',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    validate,
  ],
  AuthController.verifyEmail
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  AuthController.login
);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email required'),
    validate,
  ],
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
  AuthController.resetPassword
);

router.post(
  '/resend-verification',
  [
    body('email').isEmail().withMessage('Valid email required'),
    validate,
  ],
  AuthController.resendVerificationOTP
);

export default router;
