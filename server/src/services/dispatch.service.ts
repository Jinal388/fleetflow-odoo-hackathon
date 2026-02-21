import { Dispatch, IDispatch } from '../models/dispatch.model';
import { VehicleService } from './vehicle.service';
import { DriverService } from './driver.service';
import { DISPATCH_STATUS, VEHICLE_STATUS, DRIVER_STATUS } from '../config/constants';

export class DispatchService {
  static async createDispatch(data: Partial<IDispatch>): Promise<IDispatch> {
    const vehicle = await VehicleService.getVehicleById(data.vehicle!.toString());
    const driver = await DriverService.getDriverById(data.driver!.toString());

    if (!vehicle || vehicle.status !== VEHICLE_STATUS.AVAILABLE) {
      throw new Error('Vehicle not available');
    }

    if (!driver || driver.status !== DRIVER_STATUS.ON_DUTY) {
      throw new Error('Driver not available');
    }

    return await Dispatch.create(data);
  }

  static async getAllDispatches(filters: any = {}): Promise<IDispatch[]> {
    return await Dispatch.find(filters).populate('vehicle driver approvedBy createdBy');
  }

  static async getDispatchById(id: string): Promise<IDispatch | null> {
    return await Dispatch.findById(id).populate('vehicle driver approvedBy createdBy');
  }

  static async updateDispatch(id: string, data: Partial<IDispatch>): Promise<IDispatch | null> {
    return await Dispatch.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async approveDispatch(id: string, approvedBy: string): Promise<IDispatch | null> {
    const dispatch = await Dispatch.findById(id);
    if (!dispatch) throw new Error('Dispatch not found');

    if (dispatch.status !== DISPATCH_STATUS.PENDING) {
      throw new Error('Only pending dispatches can be approved');
    }

    dispatch.status = DISPATCH_STATUS.APPROVED;
    dispatch.approvedBy = approvedBy as any;
    return await dispatch.save();
  }

  static async startDispatch(id: string): Promise<IDispatch | null> {
    const dispatch = await Dispatch.findById(id);
    if (!dispatch) throw new Error('Dispatch not found');

    if (dispatch.status !== DISPATCH_STATUS.APPROVED) {
      throw new Error('Dispatch must be approved before starting');
    }

    await VehicleService.updateVehicleStatus(dispatch.vehicle.toString(), VEHICLE_STATUS.ON_TRIP);
    await DriverService.updateDriverStatus(dispatch.driver.toString(), DRIVER_STATUS.ON_TRIP);

    dispatch.status = DISPATCH_STATUS.IN_PROGRESS;
    dispatch.actualDeparture = new Date();
    return await dispatch.save();
  }

  static async completeDispatch(id: string): Promise<IDispatch | null> {
    const dispatch = await Dispatch.findById(id);
    if (!dispatch) throw new Error('Dispatch not found');

    if (dispatch.status !== DISPATCH_STATUS.IN_PROGRESS) {
      throw new Error('Only in-progress dispatches can be completed');
    }

    await VehicleService.updateVehicleStatus(dispatch.vehicle.toString(), VEHICLE_STATUS.AVAILABLE);
    await DriverService.updateDriverStatus(dispatch.driver.toString(), DRIVER_STATUS.ON_DUTY);

    dispatch.status = DISPATCH_STATUS.COMPLETED;
    dispatch.actualArrival = new Date();
    return await dispatch.save();
  }

  static async cancelDispatch(id: string): Promise<IDispatch | null> {
    const dispatch = await Dispatch.findById(id);
    if (!dispatch) throw new Error('Dispatch not found');

    if (dispatch.status === DISPATCH_STATUS.COMPLETED) {
      throw new Error('Cannot cancel completed dispatch');
    }

    if (dispatch.status === DISPATCH_STATUS.IN_PROGRESS) {
      await VehicleService.updateVehicleStatus(dispatch.vehicle.toString(), VEHICLE_STATUS.AVAILABLE);
      await DriverService.updateDriverStatus(dispatch.driver.toString(), DRIVER_STATUS.ON_DUTY);
    }

    dispatch.status = DISPATCH_STATUS.CANCELLED;
    return await dispatch.save();
  }
}
