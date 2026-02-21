"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const api_response_utility_1 = require("../utils/api.response.utility");
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return api_response_utility_1.ApiResponse.unauthorized(res, 'Authentication required');
        }
        if (!allowedRoles.includes(req.user.role)) {
            return api_response_utility_1.ApiResponse.forbidden(res, 'Insufficient permissions');
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=role.middleware.js.map