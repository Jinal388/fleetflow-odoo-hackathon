import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class DispatchController {
    static createDispatch(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllDispatches(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDispatchById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static approveDispatch(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static startDispatch(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static completeDispatch(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static cancelDispatch(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=dispatch.controller.d.ts.map