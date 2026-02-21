import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class MaintenanceController {
    static createMaintenance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllMaintenance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getMaintenanceById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static completeMaintenance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static cancelMaintenance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=maintenance.controller.d.ts.map