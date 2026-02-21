"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_response_utility_1 = require("../utils/api.response.utility");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err.name === 'ValidationError') {
        return api_response_utility_1.ApiResponse.badRequest(res, 'Validation error', err.errors);
    }
    if (err.name === 'CastError') {
        return api_response_utility_1.ApiResponse.badRequest(res, 'Invalid ID format');
    }
    if (err.code === 11000) {
        return api_response_utility_1.ApiResponse.conflict(res, 'Duplicate entry', err.keyValue);
    }
    return api_response_utility_1.ApiResponse.error(res, err.message || 'Internal server error', err.statusCode || 500);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map