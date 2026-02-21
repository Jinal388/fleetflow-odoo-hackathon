"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../config/constants");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: Object.values(constants_1.ROLES), required: true, default: constants_1.ROLES.DISPATCHER },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String, select: false },
    verificationOTPExpiry: { type: Date, select: false },
    resetOTP: { type: String, select: false },
    resetOTPExpiry: { type: Date, select: false },
}, { timestamps: true });
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    this.password = await bcryptjs_1.default.hash(this.password, 12);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
userSchema.methods.generateOTP = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
userSchema.methods.isOTPValid = function (otp, type) {
    const otpField = type === 'verification' ? this.verificationOTP : this.resetOTP;
    const expiryField = type === 'verification' ? this.verificationOTPExpiry : this.resetOTPExpiry;
    if (!otpField || !expiryField)
        return false;
    if (otpField !== otp)
        return false;
    if (new Date() > expiryField)
        return false;
    return true;
};
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.model.js.map