"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("./auth.controller");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const constants_1 = require("../../config/constants");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('role').optional().isIn([constants_1.ROLES.MANAGER, constants_1.ROLES.DISPATCHER]).withMessage('Invalid role. Only manager and dispatcher roles can be registered via API'),
    validation_middleware_1.validate,
], auth_controller_1.AuthController.register);
router.post('/verify-email', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    validation_middleware_1.validate,
], auth_controller_1.AuthController.verifyEmail);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    validation_middleware_1.validate,
], auth_controller_1.AuthController.login);
router.post('/forgot-password', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    validation_middleware_1.validate,
], auth_controller_1.AuthController.forgotPassword);
router.post('/reset-password', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validation_middleware_1.validate,
], auth_controller_1.AuthController.resetPassword);
router.post('/resend-verification', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
    validation_middleware_1.validate,
], auth_controller_1.AuthController.resendVerificationOTP);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map