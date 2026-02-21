"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchService = void 0;
const dispatch_model_1 = require("../models/dispatch.model");
const vehicle_service_1 = require("./vehicle.service");
const driver_service_1 = require("./driver.service");
const constants_1 = require("../config/constants");
class DispatchService {
    static async createDispatch(data) {
        const vehicle = await vehicle_service_1.VehicleService.getVehicleById(data.vehicle.toString());
        const driver = await driver_service_1.DriverService.getDriverById(data.driver.toString());
        if (!vehicle || vehicle.status !== constants_1.VEHICLE_STATUS.AVAILABLE) {
            throw new Error('Vehicle not available');
        }
        if (!driver || driver.status !== constants_1.DRIVER_STATUS.ON_DUTY) {
            throw new Error('Driver not available');
        }
        return await dispatch_model_1.Dispatch.create(data);
    }
    static async getAllDispatches(filters = {}) {
        return await dispatch_model_1.Dispatch.find(filters).populate('vehicle driver approvedBy createdBy');
    }
    static async getDispatchById(id) {
        return await dispatch_model_1.Dispatch.findById(id).populate('vehicle driver approvedBy createdBy');
    }
    static async updateDispatch(id, data) {
        return await dispatch_model_1.Dispatch.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    static async approveDispatch(id, approvedBy) {
        const dispatch = await dispatch_model_1.Dispatch.findById(id);
        if (!dispatch)
            throw new Error('Dispatch not found');
        if (dispatch.status !== constants_1.DISPATCH_STATUS.PENDING) {
            throw new Error('Only pending dispatches can be approved');
        }
        dispatch.status = constants_1.DISPATCH_STATUS.APPROVED;
        dispatch.approvedBy = approvedBy;
        return await dispatch.save();
    }
    static async startDispatch(id) {
        const dispatch = await dispatch_model_1.Dispatch.findById(id);
        if (!dispatch)
            throw new Error('Dispatch not found');
        if (dispatch.status !== constants_1.DISPATCH_STATUS.APPROVED) {
            throw new Error('Dispatch must be approved before starting');
        }
        await vehicle_service_1.VehicleService.updateVehicleStatus(dispatch.vehicle.toString(), constants_1.VEHICLE_STATUS.ON_TRIP);
        await driver_service_1.DriverService.updateDriverStatus(dispatch.driver.toString(), constants_1.DRIVER_STATUS.ON_TRIP);
        dispatch.status = constants_1.DISPATCH_STATUS.IN_PROGRESS;
        dispatch.actualDeparture = new Date();
        return await dispatch.save();
    }
    static async completeDispatch(id) {
        const dispatch = await dispatch_model_1.Dispatch.findById(id);
        if (!dispatch)
            throw new Error('Dispatch not found');
        if (dispatch.status !== constants_1.DISPATCH_STATUS.IN_PROGRESS) {
            throw new Error('Only in-progress dispatches can be completed');
        }
        await vehicle_service_1.VehicleService.updateVehicleStatus(dispatch.vehicle.toString(), constants_1.VEHICLE_STATUS.AVAILABLE);
        await driver_service_1.DriverService.updateDriverStatus(dispatch.driver.toString(), constants_1.DRIVER_STATUS.ON_DUTY);
        dispatch.status = constants_1.DISPATCH_STATUS.COMPLETED;
        dispatch.actualArrival = new Date();
        return await dispatch.save();
    }
    static async cancelDispatch(id) {
        const dispatch = await dispatch_model_1.Dispatch.findById(id);
        if (!dispatch)
            throw new Error('Dispatch not found');
        if (dispatch.status === constants_1.DISPATCH_STATUS.COMPLETED) {
            throw new Error('Cannot cancel completed dispatch');
        }
        if (dispatch.status === constants_1.DISPATCH_STATUS.IN_PROGRESS) {
            await vehicle_service_1.VehicleService.updateVehicleStatus(dispatch.vehicle.toString(), constants_1.VEHICLE_STATUS.AVAILABLE);
            await driver_service_1.DriverService.updateDriverStatus(dispatch.driver.toString(), constants_1.DRIVER_STATUS.ON_DUTY);
        }
        dispatch.status = constants_1.DISPATCH_STATUS.CANCELLED;
        return await dispatch.save();
    }
}
exports.DispatchService = DispatchService;
//# sourceMappingURL=dispatch.service.js.map