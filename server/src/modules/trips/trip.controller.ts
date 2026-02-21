import { Response } from 'express';
import { TripService } from '../../services/trip.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class TripController {
  static async createTrip(req: AuthRequest, res: Response) {
    try {
      const trip = await TripService.createTrip({
        ...req.body,
        createdBy: req.user!.userId,
      });
      return ApiResponse.created(res, trip, 'Trip created successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllTrips(req: AuthRequest, res: Response) {
    try {
      const trips = await TripService.getAllTrips(req.query);
      return ApiResponse.success(res, trips);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getTripById(req: AuthRequest, res: Response) {
    try {
      const trip = await TripService.getTripById(req.params.id as string);
      if (!trip) return ApiResponse.notFound(res, 'Trip not found');
      return ApiResponse.success(res, trip);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async updateTrip(req: AuthRequest, res: Response) {
    try {
      const trip = await TripService.updateTrip(req.params.id as string, req.body);
      return ApiResponse.success(res, trip, 'Trip updated successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async dispatchTrip(req: AuthRequest, res: Response) {
    try {
      const trip = await TripService.dispatchTrip(req.params.id as string);
      return ApiResponse.success(res, trip, 'Trip dispatched successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async completeTrip(req: AuthRequest, res: Response) {
    try {
      const { endOdometer } = req.body;
      const trip = await TripService.completeTrip(req.params.id as string, endOdometer);
      return ApiResponse.success(res, trip, 'Trip completed successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async cancelTrip(req: AuthRequest, res: Response) {
    try {
      const trip = await TripService.cancelTrip(req.params.id as string);
      return ApiResponse.success(res, trip, 'Trip cancelled successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async getTripsByVehicle(req: AuthRequest, res: Response) {
    try {
      const trips = await TripService.getTripsByVehicle(req.params.vehicleId as string);
      return ApiResponse.success(res, trips);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getTripsByDriver(req: AuthRequest, res: Response) {
    try {
      const trips = await TripService.getTripsByDriver(req.params.driverId as string);
      return ApiResponse.success(res, trips);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getActiveTrips(req: AuthRequest, res: Response) {
    try {
      const trips = await TripService.getActiveTrips();
      return ApiResponse.success(res, trips);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }
}
