"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const driver_controller_1 = require("./driver.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const constants_1 = require("../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name required'),
    (0, express_validator_1.body)('licenseNumber').notEmpty().withMessage('License number required'),
    (0, express_validator_1.body)('licenseExpiry').isISO8601().withMessage('Valid license expiry date required'),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone required'),
    validation_middleware_1.validate,
], driver_controller_1.DriverController.createDriver);
router.get('/', driver_controller_1.DriverController.getAllDrivers);
router.get('/available', driver_controller_1.DriverController.getAvailableDrivers);
router.get('/:id', driver_controller_1.DriverController.getDriverById);
router.put('/:id', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), driver_controller_1.DriverController.updateDriver);
router.delete('/:id', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN), driver_controller_1.DriverController.deleteDriver);
exports.default = router;
//# sourceMappingURL=driver.routes.js.map