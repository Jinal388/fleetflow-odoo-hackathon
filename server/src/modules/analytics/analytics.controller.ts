import { Response } from 'express';
import { AnalyticsService } from '../../services/analytics.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AnalyticsController {
  static async getFuelEfficiency(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const dateRange = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };
      
      const result = await AnalyticsService.getFuelEfficiency(dateRange);
      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getVehicleROI(req: AuthRequest, res: Response) {
    try {
      const { vehicleId, startDate, endDate } = req.query;
      const dateRange = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };
      
      const result = await AnalyticsService.getVehicleROI(vehicleId as string, dateRange);
      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getFleetUtilization(req: AuthRequest, res: Response) {
    try {
      const result = await AnalyticsService.getFleetUtilization();
      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getOperationalCostSummary(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate, groupBy } = req.query;
      
      if (!startDate || !endDate) {
        return ApiResponse.badRequest(res, 'Start date and end date are required');
      }

      const result = await AnalyticsService.getOperationalCostSummary(
        new Date(startDate as string),
        new Date(endDate as string),
        (groupBy as 'day' | 'week' | 'month') || 'month'
      );
      
      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getCostPerKm(req: AuthRequest, res: Response) {
    try {
      const { vehicleId } = req.query;
      const result = await AnalyticsService.getCostPerKm(vehicleId as string);
      return ApiResponse.success(res, result);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }
}
