import { Response } from 'express';
import { DispatchService } from '../../services/dispatch.service';
import { ApiResponse } from '../../utils/api.response.utility';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class DispatchController {
  static async createDispatch(req: AuthRequest, res: Response) {
    try {
      const dispatch = await DispatchService.createDispatch({
        ...req.body,
        createdBy: req.user!.userId,
      });
      return ApiResponse.created(res, dispatch, 'Dispatch created successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async getAllDispatches(req: AuthRequest, res: Response) {
    try {
      const dispatches = await DispatchService.getAllDispatches(req.query);
      return ApiResponse.success(res, dispatches);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async getDispatchById(req: AuthRequest, res: Response) {
    try {
      const dispatch = await DispatchService.getDispatchById(req.params.id as string);
      if (!dispatch) return ApiResponse.notFound(res, 'Dispatch not found');
      return ApiResponse.success(res, dispatch);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  }

  static async approveDispatch(req: AuthRequest, res: Response) {
    try {
      const dispatch = await DispatchService.approveDispatch(req.params.id as string, req.user!.userId);
      return ApiResponse.success(res, dispatch, 'Dispatch approved successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async startDispatch(req: AuthRequest, res: Response) {
    try {
      const dispatch = await DispatchService.startDispatch(req.params.id as string);
      return ApiResponse.success(res, dispatch, 'Dispatch started successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async completeDispatch(req: AuthRequest, res: Response) {
    try {
      const dispatch = await DispatchService.completeDispatch(req.params.id as string);
      return ApiResponse.success(res, dispatch, 'Dispatch completed successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }

  static async cancelDispatch(req: AuthRequest, res: Response) {
    try {
      const dispatch = await DispatchService.cancelDispatch(req.params.id as string);
      return ApiResponse.success(res, dispatch, 'Dispatch cancelled successfully');
    } catch (error: any) {
      return ApiResponse.badRequest(res, error.message);
    }
  }
}
