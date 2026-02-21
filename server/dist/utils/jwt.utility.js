"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtility = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtility {
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
}
exports.JwtUtility = JwtUtility;
JwtUtility.secret = process.env.JWT_SECRET || 'default-secret-key';
JwtUtility.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
//# sourceMappingURL=jwt.utility.js.map