"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const vehicle_controller_1 = require("./vehicle.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const constants_1 = require("../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), [
    (0, express_validator_1.body)('registrationNumber').notEmpty().withMessage('Registration number required'),
    (0, express_validator_1.body)('make').notEmpty().withMessage('Make required'),
    (0, express_validator_1.body)('vehicleModel').notEmpty().withMessage('Model required'),
    (0, express_validator_1.body)('year').isInt({ min: 1900 }).withMessage('Valid year required'),
    (0, express_validator_1.body)('fuelType').isIn(['petrol', 'diesel', 'electric', 'hybrid']).withMessage('Invalid fuel type'),
    (0, express_validator_1.body)('capacity').isInt({ min: 1 }).withMessage('Valid capacity required'),
    validation_middleware_1.validate,
], vehicle_controller_1.VehicleController.createVehicle);
router.get('/', vehicle_controller_1.VehicleController.getAllVehicles);
router.get('/available', vehicle_controller_1.VehicleController.getAvailableVehicles);
router.get('/:id', vehicle_controller_1.VehicleController.getVehicleById);
router.put('/:id', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), vehicle_controller_1.VehicleController.updateVehicle);
router.delete('/:id', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN), vehicle_controller_1.VehicleController.deleteVehicle);
exports.default = router;
//# sourceMappingURL=vehicle.routes.js.map