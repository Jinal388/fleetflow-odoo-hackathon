import { Trip, ITrip } from '../models/trip.model';
import { Vehicle } from '../models/vehicle.model';
import { Driver } from '../models/driver.model';
import { TRIP_STATUS, VEHICLE_STATUS, DRIVER_STATUS } from '../config/constants';
import mongoose from 'mongoose';

export class TripService {
  static async createTrip(data: Partial<ITrip>): Promise<ITrip> {
    const trip = await Trip.create({
      ...data,
      status: TRIP_STATUS.DRAFT,
    });
    return trip.populate('vehicle driver createdBy');
  }

  static async getAllTrips(filters: any = {}): Promise<ITrip[]> {
    return await Trip.find(filters)
      .populate('vehicle driver createdBy')
      .sort({ createdAt: -1 });
  }

  static async getTripById(id: string): Promise<ITrip | null> {
    return await Trip.findById(id).populate('vehicle driver createdBy');
  }

  static async updateTrip(id: string, data: Partial<ITrip>): Promise<ITrip | null> {
    const trip = await Trip.findById(id);
    if (!trip) throw new Error('Trip not found');

    if (trip.status !== TRIP_STATUS.DRAFT) {
      throw new Error('Only draft trips can be updated');
    }

    Object.assign(trip, data);
    await trip.save();
    return trip.populate('vehicle driver createdBy');
  }

  static async dispatchTrip(id: string): Promise<ITrip> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const trip = await Trip.findById(id).session(session);
      if (!trip) throw new Error('Trip not found');

      // Validate state transition
      if (!trip.canTransitionTo(TRIP_STATUS.DISPATCHED)) {
        throw new Error(`Cannot dispatch trip from ${trip.status} status`);
      }

      // Fetch vehicle and driver
      const vehicle = await Vehicle.findById(trip.vehicle).session(session);
      const driver = await Driver.findById(trip.driver).session(session);

      if (!vehicle) throw new Error('Vehicle not found');
      if (!driver) throw new Error('Driver not found');

      // Critical validations
      if (trip.cargoWeight > vehicle.maxLoadCapacity) {
        throw new Error(`Cargo weight (${trip.cargoWeight}) exceeds vehicle capacity (${vehicle.maxLoadCapacity})`);
      }

      if (vehicle.status !== VEHICLE_STATUS.AVAILABLE) {
        throw new Error(`Vehicle is not available (current status: ${vehicle.status})`);
      }

      if (!driver.canBeAssigned()) {
        throw new Error(`Driver cannot be assigned (status: ${driver.status}, license valid: ${driver.isLicenseValid()})`);
      }

      if (!driver.isLicenseValid()) {
        throw new Error('Driver license has expired');
      }

      // Lock resources
      vehicle.status = VEHICLE_STATUS.ON_TRIP;
      driver.status = DRIVER_STATUS.ON_TRIP;
      driver.totalTrips += 1;

      // Record start odometer
      trip.startOdometer = vehicle.odometer;
      trip.status = TRIP_STATUS.DISPATCHED;

      await vehicle.save({ session });
      await driver.save({ session });
      await trip.save({ session });

      await session.commitTransaction();
      return trip.populate('vehicle driver createdBy');
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async completeTrip(id: string, endOdometer: number): Promise<ITrip> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const trip = await Trip.findById(id).session(session);
      if (!trip) throw new Error('Trip not found');

      // Validate state transition
      if (!trip.canTransitionTo(TRIP_STATUS.COMPLETED)) {
        throw new Error(`Cannot complete trip from ${trip.status} status`);
      }

      // Validate endOdometer
      if (endOdometer < trip.startOdometer) {
        throw new Error('End odometer must be greater than or equal to start odometer');
      }

      // Fetch vehicle and driver
      const vehicle = await Vehicle.findById(trip.vehicle).session(session);
      const driver = await Driver.findById(trip.driver).session(session);

      if (!vehicle) throw new Error('Vehicle not found');
      if (!driver) throw new Error('Driver not found');

      // Update trip
      trip.endOdometer = endOdometer;
      trip.distance = trip.calculateDistance();
      trip.status = TRIP_STATUS.COMPLETED;

      // Release resources
      vehicle.status = VEHICLE_STATUS.AVAILABLE;
      vehicle.odometer = endOdometer;
      vehicle.mileage = endOdometer;

      driver.status = DRIVER_STATUS.ON_DUTY;
      driver.completedTrips += 1;

      await vehicle.save({ session });
      await driver.save({ session });
      await trip.save({ session });

      await session.commitTransaction();
      return trip.populate('vehicle driver createdBy');
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async cancelTrip(id: string): Promise<ITrip> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const trip = await Trip.findById(id).session(session);
      if (!trip) throw new Error('Trip not found');

      // Validate state transition
      if (!trip.canTransitionTo(TRIP_STATUS.CANCELLED)) {
        throw new Error(`Cannot cancel trip from ${trip.status} status`);
      }

      // If dispatched, release resources
      if (trip.status === TRIP_STATUS.DISPATCHED) {
        const vehicle = await Vehicle.findById(trip.vehicle).session(session);
        const driver = await Driver.findById(trip.driver).session(session);

        if (vehicle) {
          vehicle.status = VEHICLE_STATUS.AVAILABLE;
          await vehicle.save({ session });
        }

        if (driver) {
          driver.status = DRIVER_STATUS.ON_DUTY;
          driver.totalTrips -= 1; // Rollback trip count
          await driver.save({ session });
        }
      }

      trip.status = TRIP_STATUS.CANCELLED;
      await trip.save({ session });

      await session.commitTransaction();
      return trip.populate('vehicle driver createdBy');
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getTripsByVehicle(vehicleId: string): Promise<ITrip[]> {
    return await Trip.find({ vehicle: vehicleId })
      .populate('driver createdBy')
      .sort({ createdAt: -1 });
  }

  static async getTripsByDriver(driverId: string): Promise<ITrip[]> {
    return await Trip.find({ driver: driverId })
      .populate('vehicle createdBy')
      .sort({ createdAt: -1 });
  }

  static async getActiveTrips(): Promise<ITrip[]> {
    return await Trip.find({ status: TRIP_STATUS.DISPATCHED })
      .populate('vehicle driver createdBy');
  }
}
