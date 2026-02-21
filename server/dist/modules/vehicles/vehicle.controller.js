"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const vehicle_service_1 = require("../../services/vehicle.service");
const api_response_utility_1 = require("../../utils/api.response.utility");
class VehicleController {
    static async createVehicle(req, res) {
        try {
            const vehicle = await vehicle_service_1.VehicleService.createVehicle(req.body);
            return api_response_utility_1.ApiResponse.created(res, vehicle, 'Vehicle created successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async getAllVehicles(req, res) {
        try {
            const vehicles = await vehicle_service_1.VehicleService.getAllVehicles(req.query);
            return api_response_utility_1.ApiResponse.success(res, vehicles);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async getVehicleById(req, res) {
        try {
            const vehicle = await vehicle_service_1.VehicleService.getVehicleById(req.params.id);
            if (!vehicle)
                return api_response_utility_1.ApiResponse.notFound(res, 'Vehicle not found');
            return api_response_utility_1.ApiResponse.success(res, vehicle);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async updateVehicle(req, res) {
        try {
            const vehicle = await vehicle_service_1.VehicleService.updateVehicle(req.params.id, req.body);
            if (!vehicle)
                return api_response_utility_1.ApiResponse.notFound(res, 'Vehicle not found');
            return api_response_utility_1.ApiResponse.success(res, vehicle, 'Vehicle updated successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async deleteVehicle(req, res) {
        try {
            const vehicle = await vehicle_service_1.VehicleService.deleteVehicle(req.params.id);
            if (!vehicle)
                return api_response_utility_1.ApiResponse.notFound(res, 'Vehicle not found');
            return api_response_utility_1.ApiResponse.success(res, vehicle, 'Vehicle deleted successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async getAvailableVehicles(req, res) {
        try {
            const vehicles = await vehicle_service_1.VehicleService.getAvailableVehicles();
            return api_response_utility_1.ApiResponse.success(res, vehicles);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=vehicle.controller.js.map