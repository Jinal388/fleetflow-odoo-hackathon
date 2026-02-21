"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const maintenance_controller_1 = require("./maintenance.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const constants_1 = require("../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), [
    (0, express_validator_1.body)('vehicle').notEmpty().withMessage('Vehicle required'),
    (0, express_validator_1.body)('type').isIn(['routine', 'repair', 'inspection', 'emergency']).withMessage('Invalid type'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description required'),
    (0, express_validator_1.body)('scheduledDate').isISO8601().withMessage('Valid scheduled date required'),
    (0, express_validator_1.body)('mileageAtService').isInt({ min: 0 }).withMessage('Valid mileage required'),
    validation_middleware_1.validate,
], maintenance_controller_1.MaintenanceController.createMaintenance);
router.get('/', maintenance_controller_1.MaintenanceController.getAllMaintenance);
router.get('/:id', maintenance_controller_1.MaintenanceController.getMaintenanceById);
router.patch('/:id/complete', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), [(0, express_validator_1.body)('cost').isFloat({ min: 0 }).withMessage('Valid cost required'), validation_middleware_1.validate], maintenance_controller_1.MaintenanceController.completeMaintenance);
router.patch('/:id/cancel', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), maintenance_controller_1.MaintenanceController.cancelMaintenance);
exports.default = router;
//# sourceMappingURL=maintenance.routes.js.map