import { Vehicle, IVehicle } from '../models/vehicle.model';
import { Trip } from '../models/trip.model';
import { VEHICLE_STATUS, TRIP_STATUS } from '../config/constants';

export class VehicleService {
  static async createVehicle(data: Partial<IVehicle>): Promise<IVehicle> {
    return await Vehicle.create(data);
  }

  static async getAllVehicles(filters: any = {}): Promise<IVehicle[]> {
    return await Vehicle.find({ isActive: true, ...filters });
  }

  static async getVehicleById(id: string): Promise<IVehicle | null> {
    return await Vehicle.findById(id);
  }

  static async updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    return await Vehicle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async deleteVehicle(id: string): Promise<IVehicle | null> {
    // Check for active trips
    const activeTrips = await Trip.findOne({
      vehicle: id,
      status: { $in: [TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED] },
    });

    if (activeTrips) {
      throw new Error('Cannot delete vehicle with active or draft trips');
    }

    return await Vehicle.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  static async updateVehicleStatus(id: string, status: string): Promise<IVehicle | null> {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    // Prevent assigning vehicle if in shop
    if (status === VEHICLE_STATUS.ON_TRIP && vehicle.status === VEHICLE_STATUS.IN_SHOP) {
      throw new Error('Cannot assign vehicle that is in shop');
    }

    vehicle.status = status as any;
    return await vehicle.save();
  }

  static async getAvailableVehicles(): Promise<IVehicle[]> {
    return await Vehicle.find({ status: VEHICLE_STATUS.AVAILABLE, isActive: true });
  }

  static async getVehiclesByStatus(status: string): Promise<IVehicle[]> {
    return await Vehicle.find({ status, isActive: true });
  }
}
