"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const driver_service_1 = require("../../services/driver.service");
const api_response_utility_1 = require("../../utils/api.response.utility");
class DriverController {
    static async createDriver(req, res) {
        try {
            const driver = await driver_service_1.DriverService.createDriver(req.body);
            return api_response_utility_1.ApiResponse.created(res, driver, 'Driver created successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async getAllDrivers(req, res) {
        try {
            const drivers = await driver_service_1.DriverService.getAllDrivers(req.query);
            return api_response_utility_1.ApiResponse.success(res, drivers);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async getDriverById(req, res) {
        try {
            const driver = await driver_service_1.DriverService.getDriverById(req.params.id);
            if (!driver)
                return api_response_utility_1.ApiResponse.notFound(res, 'Driver not found');
            return api_response_utility_1.ApiResponse.success(res, driver);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async updateDriver(req, res) {
        try {
            const driver = await driver_service_1.DriverService.updateDriver(req.params.id, req.body);
            if (!driver)
                return api_response_utility_1.ApiResponse.notFound(res, 'Driver not found');
            return api_response_utility_1.ApiResponse.success(res, driver, 'Driver updated successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async deleteDriver(req, res) {
        try {
            const driver = await driver_service_1.DriverService.deleteDriver(req.params.id);
            if (!driver)
                return api_response_utility_1.ApiResponse.notFound(res, 'Driver not found');
            return api_response_utility_1.ApiResponse.success(res, driver, 'Driver deleted successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async getAvailableDrivers(req, res) {
        try {
            const drivers = await driver_service_1.DriverService.getAvailableDrivers();
            return api_response_utility_1.ApiResponse.success(res, drivers);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.DriverController = DriverController;
//# sourceMappingURL=driver.controller.js.map