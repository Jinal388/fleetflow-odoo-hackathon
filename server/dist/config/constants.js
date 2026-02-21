"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUEL_ENTRY_TYPE = exports.MAINTENANCE_STATUS = exports.DISPATCH_STATUS = exports.TRIP_STATUS = exports.DRIVER_STATUS = exports.VEHICLE_STATUS = exports.ROLES = void 0;
exports.ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    DISPATCHER: 'dispatcher',
};
exports.VEHICLE_STATUS = {
    AVAILABLE: 'available',
    ON_TRIP: 'on_trip',
    IN_SHOP: 'in_shop',
    OUT_OF_SERVICE: 'out_of_service',
};
exports.DRIVER_STATUS = {
    ON_DUTY: 'on_duty',
    OFF_DUTY: 'off_duty',
    ON_TRIP: 'on_trip',
    SUSPENDED: 'suspended',
    ON_LEAVE: 'on_leave',
};
exports.TRIP_STATUS = {
    DRAFT: 'draft',
    DISPATCHED: 'dispatched',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};
exports.DISPATCH_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};
exports.MAINTENANCE_STATUS = {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};
exports.FUEL_ENTRY_TYPE = {
    REFUEL: 'refuel',
    CONSUMPTION: 'consumption',
};
//# sourceMappingURL=constants.js.map