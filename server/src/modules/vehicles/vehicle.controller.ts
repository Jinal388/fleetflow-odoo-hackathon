import { Response } from 'express';
import { VehicleService } from '../../services/vehicle.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class VehicleController {
  static async createVehicle(req: AuthRequest, res: Response) {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      return ApiResponse.created(res, vehicle, 'Vehicle created successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllVehicles(req: AuthRequest, res: Response) {
    try {
      const vehicles = await VehicleService.getAllVehicles(req.query);
      return ApiResponse.success(res, vehicles);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getVehicleById(req: AuthRequest, res: Response) {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id as string);
      if (!vehicle) return ApiResponse.notFound(res, 'Vehicle not found');
      return ApiResponse.success(res, vehicle);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async updateVehicle(req: AuthRequest, res: Response) {
    try {
      const vehicle = await VehicleService.updateVehicle(req.params.id as string, req.body);
      if (!vehicle) return ApiResponse.notFound(res, 'Vehicle not found');
      return ApiResponse.success(res, vehicle, 'Vehicle updated successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async deleteVehicle(req: AuthRequest, res: Response) {
    try {
      const vehicle = await VehicleService.deleteVehicle(req.params.id as string);
      if (!vehicle) return ApiResponse.notFound(res, 'Vehicle not found');
      return ApiResponse.success(res, vehicle, 'Vehicle deleted successfully');
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getAvailableVehicles(req: AuthRequest, res: Response) {
    try {
      const vehicles = await VehicleService.getAvailableVehicles();
      return ApiResponse.success(res, vehicles);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }
}
