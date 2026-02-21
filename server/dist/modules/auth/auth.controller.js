"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../../services/auth.service");
const api_response_utility_1 = require("../../utils/api.response.utility");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, name, role } = req.body;
            const requestingUserRole = req.user?.role;
            const result = await auth_service_1.AuthService.register(email, password, name, role, requestingUserRole);
            return api_response_utility_1.ApiResponse.created(res, result.user, result.message);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async verifyEmail(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await auth_service_1.AuthService.verifyEmail(email, otp);
            return api_response_utility_1.ApiResponse.success(res, result, 'Email verified successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login(email, password);
            return api_response_utility_1.ApiResponse.success(res, result, 'Login successful');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.unauthorized(res, error.message);
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await auth_service_1.AuthService.forgotPassword(email);
            return api_response_utility_1.ApiResponse.success(res, null, result.message);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            const result = await auth_service_1.AuthService.resetPassword(email, otp, newPassword);
            return api_response_utility_1.ApiResponse.success(res, null, result.message);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async resendVerificationOTP(req, res) {
        try {
            const { email } = req.body;
            const result = await auth_service_1.AuthService.resendVerificationOTP(email);
            return api_response_utility_1.ApiResponse.success(res, null, result.message);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map