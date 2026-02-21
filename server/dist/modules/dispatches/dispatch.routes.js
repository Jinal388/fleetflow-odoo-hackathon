"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const dispatch_controller_1 = require("./dispatch.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const constants_1 = require("../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER, constants_1.ROLES.DISPATCHER), [
    (0, express_validator_1.body)('vehicle').notEmpty().withMessage('Vehicle required'),
    (0, express_validator_1.body)('driver').notEmpty().withMessage('Driver required'),
    (0, express_validator_1.body)('origin').notEmpty().withMessage('Origin required'),
    (0, express_validator_1.body)('destination').notEmpty().withMessage('Destination required'),
    (0, express_validator_1.body)('scheduledDeparture').isISO8601().withMessage('Valid scheduled departure required'),
    (0, express_validator_1.body)('scheduledArrival').isISO8601().withMessage('Valid scheduled arrival required'),
    (0, express_validator_1.body)('purpose').notEmpty().withMessage('Purpose required'),
    validation_middleware_1.validate,
], dispatch_controller_1.DispatchController.createDispatch);
router.get('/', dispatch_controller_1.DispatchController.getAllDispatches);
router.get('/:id', dispatch_controller_1.DispatchController.getDispatchById);
router.patch('/:id/approve', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), dispatch_controller_1.DispatchController.approveDispatch);
router.patch('/:id/start', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER, constants_1.ROLES.DISPATCHER), dispatch_controller_1.DispatchController.startDispatch);
router.patch('/:id/complete', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER, constants_1.ROLES.DISPATCHER), dispatch_controller_1.DispatchController.completeDispatch);
router.patch('/:id/cancel', (0, role_middleware_1.authorize)(constants_1.ROLES.ADMIN, constants_1.ROLES.MANAGER), dispatch_controller_1.DispatchController.cancelDispatch);
exports.default = router;
//# sourceMappingURL=dispatch.routes.js.map