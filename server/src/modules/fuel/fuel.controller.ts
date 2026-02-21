import { Response } from 'express';
import { FuelService } from '../../services/fuel.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class FuelController {
  static async createFuelEntry(req: AuthRequest, res: Response) {
    try {
      const fuel = await FuelService.createFuelEntry({
        ...req.body,
        createdBy: req.user!.userId,
      });
      return ApiResponse.created(res, fuel, 'Fuel entry created successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllFuelEntries(req: AuthRequest, res: Response) {
    try {
      const fuel = await FuelService.getAllFuelEntries(req.query);
      return ApiResponse.success(res, fuel);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getFuelEntryById(req: AuthRequest, res: Response) {
    try {
      const fuel = await FuelService.getFuelEntryById(req.params.id as string);
      if (!fuel) return ApiResponse.notFound(res, 'Fuel entry not found');
      return ApiResponse.success(res, fuel);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getFuelStatsByVehicle(req: AuthRequest, res: Response) {
    try {
      const stats = await FuelService.getFuelStatsByVehicle(req.params.vehicleId as string);
      return ApiResponse.success(res, stats);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }
}
