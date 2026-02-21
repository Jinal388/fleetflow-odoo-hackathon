"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceController = void 0;
const maintenance_service_1 = require("../../services/maintenance.service");
const api_response_utility_1 = require("../../utils/api.response.utility");
class MaintenanceController {
    static async createMaintenance(req, res) {
        try {
            const maintenance = await maintenance_service_1.MaintenanceService.createMaintenance({
                ...req.body,
                createdBy: req.user.userId,
            });
            return api_response_utility_1.ApiResponse.created(res, maintenance, 'Maintenance scheduled successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async getAllMaintenance(req, res) {
        try {
            const maintenance = await maintenance_service_1.MaintenanceService.getAllMaintenance(req.query);
            return api_response_utility_1.ApiResponse.success(res, maintenance);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async getMaintenanceById(req, res) {
        try {
            const maintenance = await maintenance_service_1.MaintenanceService.getMaintenanceById(req.params.id);
            if (!maintenance)
                return api_response_utility_1.ApiResponse.notFound(res, 'Maintenance record not found');
            return api_response_utility_1.ApiResponse.success(res, maintenance);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async completeMaintenance(req, res) {
        try {
            const { cost } = req.body;
            const maintenance = await maintenance_service_1.MaintenanceService.completeMaintenance(req.params.id, cost);
            return api_response_utility_1.ApiResponse.success(res, maintenance, 'Maintenance completed successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async cancelMaintenance(req, res) {
        try {
            const maintenance = await maintenance_service_1.MaintenanceService.cancelMaintenance(req.params.id);
            return api_response_utility_1.ApiResponse.success(res, maintenance, 'Maintenance cancelled successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
}
exports.MaintenanceController = MaintenanceController;
//# sourceMappingURL=maintenance.controller.js.map