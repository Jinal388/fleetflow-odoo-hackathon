"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const maintenance_model_1 = require("../models/maintenance.model");
const vehicle_service_1 = require("./vehicle.service");
const vehicle_model_1 = require("../models/vehicle.model");
const trip_model_1 = require("../models/trip.model");
const constants_1 = require("../config/constants");
class MaintenanceService {
    static async createMaintenance(data) {
        // Check if vehicle has active trips
        const activeTrips = await trip_model_1.Trip.findOne({
            vehicle: data.vehicle,
            status: constants_1.TRIP_STATUS.DISPATCHED,
        });
        if (activeTrips) {
            throw new Error('Cannot schedule maintenance for vehicle with active trips');
        }
        const vehicle = await vehicle_model_1.Vehicle.findById(data.vehicle);
        if (!vehicle)
            throw new Error('Vehicle not found');
        // Set vehicle to IN_SHOP status
        vehicle.status = constants_1.VEHICLE_STATUS.IN_SHOP;
        await vehicle.save();
        const maintenance = await maintenance_model_1.Maintenance.create(data);
        return maintenance.populate('vehicle createdBy');
    }
    static async getAllMaintenance(filters = {}) {
        return await maintenance_model_1.Maintenance.find(filters).populate('vehicle createdBy');
    }
    static async getMaintenanceById(id) {
        return await maintenance_model_1.Maintenance.findById(id).populate('vehicle createdBy');
    }
    static async updateMaintenance(id, data) {
        return await maintenance_model_1.Maintenance.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    static async completeMaintenance(id, cost) {
        const maintenance = await maintenance_model_1.Maintenance.findById(id);
        if (!maintenance)
            throw new Error('Maintenance record not found');
        if (maintenance.status === constants_1.MAINTENANCE_STATUS.COMPLETED) {
            throw new Error('Maintenance already completed');
        }
        maintenance.status = constants_1.MAINTENANCE_STATUS.COMPLETED;
        maintenance.completedDate = new Date();
        maintenance.cost = cost;
        // Set vehicle back to AVAILABLE
        await vehicle_service_1.VehicleService.updateVehicleStatus(maintenance.vehicle.toString(), constants_1.VEHICLE_STATUS.AVAILABLE);
        await vehicle_service_1.VehicleService.updateVehicle(maintenance.vehicle.toString(), {
            lastMaintenanceDate: new Date(),
        });
        return await maintenance.save();
    }
    static async cancelMaintenance(id) {
        const maintenance = await maintenance_model_1.Maintenance.findById(id);
        if (!maintenance)
            throw new Error('Maintenance record not found');
        maintenance.status = constants_1.MAINTENANCE_STATUS.CANCELLED;
        // Set vehicle back to AVAILABLE
        await vehicle_service_1.VehicleService.updateVehicleStatus(maintenance.vehicle.toString(), constants_1.VEHICLE_STATUS.AVAILABLE);
        return await maintenance.save();
    }
    static async getMaintenanceCostByVehicle(vehicleId) {
        const result = await maintenance_model_1.Maintenance.aggregate([
            { $match: { vehicle: vehicleId, status: constants_1.MAINTENANCE_STATUS.COMPLETED } },
            { $group: { _id: null, totalCost: { $sum: '$cost' } } },
        ]);
        return result[0]?.totalCost || 0;
    }
}
exports.MaintenanceService = MaintenanceService;
//# sourceMappingURL=maintenance.service.js.map