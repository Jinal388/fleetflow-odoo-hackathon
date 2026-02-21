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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../config/constants");
const vehicleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    vehicleModel: { type: String, required: true, trim: true },
    make: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
    licensePlate: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    maxLoadCapacity: { type: Number, required: true, min: 0.1 },
    odometer: { type: Number, required: true, min: 0, default: 0 },
    acquisitionCost: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(constants_1.VEHICLE_STATUS), default: constants_1.VEHICLE_STATUS.AVAILABLE },
    mileage: { type: Number, required: true, min: 0, default: 0 },
    fuelType: { type: String, required: true, enum: ['petrol', 'diesel', 'electric', 'hybrid'] },
    capacity: { type: Number, required: true, min: 1 },
    lastMaintenanceDate: { type: Date },
    nextMaintenanceDate: { type: Date },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
// Prevent odometer from decreasing
vehicleSchema.pre('save', function () {
    if (this.isModified('odometer')) {
        const original = this._original;
        if (original && this.odometer < original.odometer) {
            throw new Error('Odometer cannot decrease');
        }
    }
});
exports.Vehicle = mongoose_1.default.model('Vehicle', vehicleSchema);
//# sourceMappingURL=vehicle.model.js.map