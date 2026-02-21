import { Response } from 'express';
import { DriverService } from '../../services/driver.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class DriverController {
  static async createDriver(req: AuthRequest, res: Response) {
    try {
      const driver = await DriverService.createDriver(req.body);
      return ApiResponse.created(res, driver, 'Driver created successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllDrivers(req: AuthRequest, res: Response) {
    try {
      const drivers = await DriverService.getAllDrivers(req.query);
      return ApiResponse.success(res, drivers);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getDriverById(req: AuthRequest, res: Response) {
    try {
      const driver = await DriverService.getDriverById(req.params.id as string);
      if (!driver) return ApiResponse.notFound(res, 'Driver not found');
      return ApiResponse.success(res, driver);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async updateDriver(req: AuthRequest, res: Response) {
    try {
      const driver = await DriverService.updateDriver(req.params.id as string, req.body);
      if (!driver) return ApiResponse.notFound(res, 'Driver not found');
      return ApiResponse.success(res, driver, 'Driver updated successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async deleteDriver(req: AuthRequest, res: Response) {
    try {
      const driver = await DriverService.deleteDriver(req.params.id as string);
      if (!driver) return ApiResponse.notFound(res, 'Driver not found');
      return ApiResponse.success(res, driver, 'Driver deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getAvailableDrivers(req: AuthRequest, res: Response) {
    try {
      const drivers = await DriverService.getAvailableDrivers();
      return ApiResponse.success(res, drivers);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }
}
