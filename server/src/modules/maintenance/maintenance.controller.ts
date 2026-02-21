import { Response } from 'express';
import { MaintenanceService } from '../../services/maintenance.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class MaintenanceController {
  static async createMaintenance(req: AuthRequest, res: Response) {
    try {
      const maintenance = await MaintenanceService.createMaintenance({
        ...req.body,
        createdBy: req.user!.userId,
      });
      return ApiResponse.created(res, maintenance, 'Maintenance scheduled successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllMaintenance(req: AuthRequest, res: Response) {
    try {
      const maintenance = await MaintenanceService.getAllMaintenance(req.query);
      return ApiResponse.success(res, maintenance);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getMaintenanceById(req: AuthRequest, res: Response) {
    try {
      const maintenance = await MaintenanceService.getMaintenanceById(req.params.id as string);
      if (!maintenance) return ApiResponse.notFound(res, 'Maintenance record not found');
      return ApiResponse.success(res, maintenance);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async completeMaintenance(req: AuthRequest, res: Response) {
    try {
      const { cost } = req.body;
      const maintenance = await MaintenanceService.completeMaintenance(req.params.id as string, cost);
      return ApiResponse.success(res, maintenance, 'Maintenance completed successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async cancelMaintenance(req: AuthRequest, res: Response) {
    try {
      const maintenance = await MaintenanceService.cancelMaintenance(req.params.id as string);
      return ApiResponse.success(res, maintenance, 'Maintenance cancelled successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }
}
