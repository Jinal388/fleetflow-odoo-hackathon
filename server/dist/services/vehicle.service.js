"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const vehicle_model_1 = require("../models/vehicle.model");
const trip_model_1 = require("../models/trip.model");
const constants_1 = require("../config/constants");
class VehicleService {
    static async createVehicle(data) {
        return await vehicle_model_1.Vehicle.create(data);
    }
    static async getAllVehicles(filters = {}) {
        return await vehicle_model_1.Vehicle.find({ isActive: true, ...filters });
    }
    static async getVehicleById(id) {
        return await vehicle_model_1.Vehicle.findById(id);
    }
    static async updateVehicle(id, data) {
        return await vehicle_model_1.Vehicle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    static async deleteVehicle(id) {
        // Check for active trips
        const activeTrips = await trip_model_1.Trip.findOne({
            vehicle: id,
            status: { $in: [constants_1.TRIP_STATUS.DRAFT, constants_1.TRIP_STATUS.DISPATCHED] },
        });
        if (activeTrips) {
            throw new Error('Cannot delete vehicle with active or draft trips');
        }
        return await vehicle_model_1.Vehicle.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
    static async updateVehicleStatus(id, status) {
        const vehicle = await vehicle_model_1.Vehicle.findById(id);
        if (!vehicle)
            throw new Error('Vehicle not found');
        // Prevent assigning vehicle if in shop
        if (status === constants_1.VEHICLE_STATUS.ON_TRIP && vehicle.status === constants_1.VEHICLE_STATUS.IN_SHOP) {
            throw new Error('Cannot assign vehicle that is in shop');
        }
        vehicle.status = status;
        return await vehicle.save();
    }
    static async getAvailableVehicles() {
        return await vehicle_model_1.Vehicle.find({ status: constants_1.VEHICLE_STATUS.AVAILABLE, isActive: true });
    }
    static async getVehiclesByStatus(status) {
        return await vehicle_model_1.Vehicle.find({ status, isActive: true });
    }
}
exports.VehicleService = VehicleService;
//# sourceMappingURL=vehicle.service.js.map