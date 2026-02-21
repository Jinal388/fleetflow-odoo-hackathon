import { Maintenance, IMaintenance } from '../models/maintenance.model';
import { VehicleService } from './vehicle.service';
import { Vehicle } from '../models/vehicle.model';
import { Trip } from '../models/trip.model';
import { MAINTENANCE_STATUS, VEHICLE_STATUS, TRIP_STATUS } from '../config/constants';

export class MaintenanceService {
  static async createMaintenance(data: Partial<IMaintenance>): Promise<IMaintenance> {
    // Check if vehicle has active trips
    const activeTrips = await Trip.findOne({
      vehicle: data.vehicle,
      status: TRIP_STATUS.DISPATCHED,
    });

    if (activeTrips) {
      throw new Error('Cannot schedule maintenance for vehicle with active trips');
    }

    const vehicle = await Vehicle.findById(data.vehicle);
    if (!vehicle) throw new Error('Vehicle not found');

    // Set vehicle to IN_SHOP status
    vehicle.status = VEHICLE_STATUS.IN_SHOP;
    await vehicle.save();

    const maintenance = await Maintenance.create(data);
    return maintenance.populate('vehicle createdBy');
  }

  static async getAllMaintenance(filters: any = {}): Promise<IMaintenance[]> {
    return await Maintenance.find(filters).populate('vehicle createdBy');
  }

  static async getMaintenanceById(id: string): Promise<IMaintenance | null> {
    return await Maintenance.findById(id).populate('vehicle createdBy');
  }

  static async updateMaintenance(id: string, data: Partial<IMaintenance>): Promise<IMaintenance | null> {
    return await Maintenance.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async completeMaintenance(id: string, cost: number): Promise<IMaintenance | null> {
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) throw new Error('Maintenance record not found');

    if (maintenance.status === MAINTENANCE_STATUS.COMPLETED) {
      throw new Error('Maintenance already completed');
    }

    maintenance.status = MAINTENANCE_STATUS.COMPLETED;
    maintenance.completedDate = new Date();
    maintenance.cost = cost;

    // Set vehicle back to AVAILABLE
    await VehicleService.updateVehicleStatus(maintenance.vehicle.toString(), VEHICLE_STATUS.AVAILABLE);
    await VehicleService.updateVehicle(maintenance.vehicle.toString(), {
      lastMaintenanceDate: new Date(),
    });

    return await maintenance.save();
  }

  static async cancelMaintenance(id: string): Promise<IMaintenance | null> {
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) throw new Error('Maintenance record not found');

    maintenance.status = MAINTENANCE_STATUS.CANCELLED;
    
    // Set vehicle back to AVAILABLE
    await VehicleService.updateVehicleStatus(maintenance.vehicle.toString(), VEHICLE_STATUS.AVAILABLE);

    return await maintenance.save();
  }

  static async getMaintenanceCostByVehicle(vehicleId: string): Promise<number> {
    const result = await Maintenance.aggregate([
      { $match: { vehicle: vehicleId, status: MAINTENANCE_STATUS.COMPLETED } },
      { $group: { _id: null, totalCost: { $sum: '$cost' } } },
    ]);

    return result[0]?.totalCost || 0;
  }
}
