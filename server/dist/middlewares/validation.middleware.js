"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const api_response_utility_1 = require("../utils/api.response.utility");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return api_response_utility_1.ApiResponse.badRequest(res, 'Validation failed', errors.array());
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map