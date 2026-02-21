import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class VehicleController {
    static createVehicle(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllVehicles(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getVehicleById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateVehicle(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteVehicle(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAvailableVehicles(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=vehicle.controller.d.ts.map