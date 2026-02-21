import { IVehicle } from '../models/vehicle.model';
export declare class VehicleService {
    static createVehicle(data: Partial<IVehicle>): Promise<IVehicle>;
    static getAllVehicles(filters?: any): Promise<IVehicle[]>;
    static getVehicleById(id: string): Promise<IVehicle | null>;
    static updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle | null>;
    static deleteVehicle(id: string): Promise<IVehicle | null>;
    static updateVehicleStatus(id: string, status: string): Promise<IVehicle | null>;
    static getAvailableVehicles(): Promise<IVehicle[]>;
    static getVehiclesByStatus(status: string): Promise<IVehicle[]>;
}
//# sourceMappingURL=vehicle.service.d.ts.map