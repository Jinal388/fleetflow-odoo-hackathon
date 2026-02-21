"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_utility_1 = require("../utils/jwt.utility");
const api_response_utility_1 = require("../utils/api.response.utility");
const user_model_1 = require("../models/user.model");
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return api_response_utility_1.ApiResponse.unauthorized(res, 'No token provided');
        }
        const decoded = jwt_utility_1.JwtUtility.verifyToken(token);
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return api_response_utility_1.ApiResponse.unauthorized(res, 'Invalid token or user inactive');
        }
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    }
    catch (error) {
        return api_response_utility_1.ApiResponse.unauthorized(res, 'Invalid or expired token');
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map