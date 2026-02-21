import { IDispatch } from '../models/dispatch.model';
export declare class DispatchService {
    static createDispatch(data: Partial<IDispatch>): Promise<IDispatch>;
    static getAllDispatches(filters?: any): Promise<IDispatch[]>;
    static getDispatchById(id: string): Promise<IDispatch | null>;
    static updateDispatch(id: string, data: Partial<IDispatch>): Promise<IDispatch | null>;
    static approveDispatch(id: string, approvedBy: string): Promise<IDispatch | null>;
    static startDispatch(id: string): Promise<IDispatch | null>;
    static completeDispatch(id: string): Promise<IDispatch | null>;
    static cancelDispatch(id: string): Promise<IDispatch | null>;
}
//# sourceMappingURL=dispatch.service.d.ts.map