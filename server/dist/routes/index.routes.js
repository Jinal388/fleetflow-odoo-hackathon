"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const vehicle_routes_1 = __importDefault(require("../modules/vehicles/vehicle.routes"));
const driver_routes_1 = __importDefault(require("../modules/drivers/driver.routes"));
const dispatch_routes_1 = __importDefault(require("../modules/dispatches/dispatch.routes"));
const maintenance_routes_1 = __importDefault(require("../modules/maintenance/maintenance.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/vehicles', vehicle_routes_1.default);
router.use('/drivers', driver_routes_1.default);
router.use('/dispatches', dispatch_routes_1.default);
router.use('/maintenance', maintenance_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.routes.js.map