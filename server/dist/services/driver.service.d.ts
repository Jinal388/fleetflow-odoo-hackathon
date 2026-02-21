import { IDriver } from '../models/driver.model';
export declare class DriverService {
    static createDriver(data: Partial<IDriver>): Promise<IDriver>;
    static getAllDrivers(filters?: any): Promise<IDriver[]>;
    static getDriverById(id: string): Promise<IDriver | null>;
    static updateDriver(id: string, data: Partial<IDriver>): Promise<IDriver | null>;
    static deleteDriver(id: string): Promise<IDriver | null>;
    static updateDriverStatus(id: string, status: string): Promise<IDriver | null>;
    static getAvailableDrivers(): Promise<IDriver[]>;
}
//# sourceMappingURL=driver.service.d.ts.map