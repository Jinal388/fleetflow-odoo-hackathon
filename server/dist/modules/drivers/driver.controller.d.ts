import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class DriverController {
    static createDriver(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllDrivers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDriverById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateDriver(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteDriver(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAvailableDrivers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=driver.controller.d.ts.map