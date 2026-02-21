import { Driver, IDriver } from '../models/driver.model';
import { DRIVER_STATUS } from '../config/constants';

export class DriverService {
  static async createDriver(data: Partial<IDriver>): Promise<IDriver> {
    return await Driver.create(data);
  }

  static async getAllDrivers(filters: any = {}): Promise<IDriver[]> {
    return await Driver.find({ isActive: true, ...filters }).populate('assignedVehicle');
  }

  static async getDriverById(id: string): Promise<IDriver | null> {
    return await Driver.findById(id).populate('assignedVehicle');
  }

  static async updateDriver(id: string, data: Partial<IDriver>): Promise<IDriver | null> {
    return await Driver.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async deleteDriver(id: string): Promise<IDriver | null> {
    return await Driver.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  static async updateDriverStatus(id: string, status: string): Promise<IDriver | null> {
    const driver = await Driver.findById(id);
    if (!driver) throw new Error('Driver not found');

    driver.status = status as any;
    return await driver.save();
  }

  static async getAvailableDrivers(): Promise<IDriver[]> {
    return await Driver.find({ status: DRIVER_STATUS.ON_DUTY, isActive: true });
  }
}
