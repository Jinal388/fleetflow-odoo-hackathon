import { Fuel, IFuel } from '../models/fuel.model';
import { VehicleService } from './vehicle.service';

export class FuelService {
  static async createFuelEntry(data: Partial<IFuel>): Promise<IFuel> {
    const fuel = await Fuel.create(data);
    if (data.mileage !== undefined) {
      await VehicleService.updateVehicle(data.vehicle!.toString(), { mileage: data.mileage });
    }
    return fuel;
  }

  static async getAllFuelEntries(filters: any = {}): Promise<IFuel[]> {
    return await Fuel.find(filters).populate('vehicle driver createdBy');
  }

  static async getFuelEntryById(id: string): Promise<IFuel | null> {
    return await Fuel.findById(id).populate('vehicle driver createdBy');
  }

  static async updateFuelEntry(id: string, data: Partial<IFuel>): Promise<IFuel | null> {
    return await Fuel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async deleteFuelEntry(id: string): Promise<IFuel | null> {
    return await Fuel.findByIdAndDelete(id);
  }

  static async getFuelStatsByVehicle(vehicleId: string): Promise<any> {
    return await Fuel.aggregate([
      { $match: { vehicle: vehicleId } },
      {
        $group: {
          _id: '$vehicle',
          totalCost: { $sum: '$cost' },
          totalQuantity: { $sum: '$quantity' },
          averagePricePerUnit: { $avg: '$pricePerUnit' },
          entryCount: { $sum: 1 },
        },
      },
    ]);
  }
}
