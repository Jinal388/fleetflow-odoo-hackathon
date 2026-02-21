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
exports.Maintenance = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../config/constants");
const maintenanceSchema = new mongoose_1.Schema({
    vehicle: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: { type: String, required: true, enum: ['routine', 'repair', 'inspection', 'emergency'], trim: true },
    description: { type: String, required: true, trim: true },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: { type: String, enum: Object.values(constants_1.MAINTENANCE_STATUS), default: constants_1.MAINTENANCE_STATUS.SCHEDULED },
    cost: { type: Number, min: 0 },
    serviceProvider: { type: String, trim: true },
    mileageAtService: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.Maintenance = mongoose_1.default.model('Maintenance', maintenanceSchema);
//# sourceMappingURL=maintenance.model.js.map