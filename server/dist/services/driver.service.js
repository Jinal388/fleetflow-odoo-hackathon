"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const driver_model_1 = require("../models/driver.model");
const constants_1 = require("../config/constants");
class DriverService {
    static async createDriver(data) {
        return await driver_model_1.Driver.create(data);
    }
    static async getAllDrivers(filters = {}) {
        return await driver_model_1.Driver.find({ isActive: true, ...filters }).populate('assignedVehicle');
    }
    static async getDriverById(id) {
        return await driver_model_1.Driver.findById(id).populate('assignedVehicle');
    }
    static async updateDriver(id, data) {
        return await driver_model_1.Driver.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    static async deleteDriver(id) {
        return await driver_model_1.Driver.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
    static async updateDriverStatus(id, status) {
        const driver = await driver_model_1.Driver.findById(id);
        if (!driver)
            throw new Error('Driver not found');
        driver.status = status;
        return await driver.save();
    }
    static async getAvailableDrivers() {
        return await driver_model_1.Driver.find({ status: constants_1.DRIVER_STATUS.ON_DUTY, isActive: true });
    }
}
exports.DriverService = DriverService;
//# sourceMappingURL=driver.service.js.map