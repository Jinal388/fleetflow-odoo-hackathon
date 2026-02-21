import { IMaintenance } from '../models/maintenance.model';
export declare class MaintenanceService {
    static createMaintenance(data: Partial<IMaintenance>): Promise<IMaintenance>;
    static getAllMaintenance(filters?: any): Promise<IMaintenance[]>;
    static getMaintenanceById(id: string): Promise<IMaintenance | null>;
    static updateMaintenance(id: string, data: Partial<IMaintenance>): Promise<IMaintenance | null>;
    static completeMaintenance(id: string, cost: number): Promise<IMaintenance | null>;
    static cancelMaintenance(id: string): Promise<IMaintenance | null>;
    static getMaintenanceCostByVehicle(vehicleId: string): Promise<number>;
}
//# sourceMappingURL=maintenance.service.d.ts.map