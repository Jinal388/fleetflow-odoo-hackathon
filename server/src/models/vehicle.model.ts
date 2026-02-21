import mongoose, { Document, Schema } from 'mongoose';
import { VEHICLE_STATUS } from '../config/constants';

export interface IVehicle extends Document {
  name: string;
  registrationNumber: string;
  vehicleModel: string;
  make: string;
  year: number;
  licensePlate: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: typeof VEHICLE_STATUS[keyof typeof VEHICLE_STATUS];
  mileage: number;
  fuelType: string;
  capacity: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    vehicleModel: { type: String, required: true, trim: true },
    make: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
    licensePlate: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    maxLoadCapacity: { type: Number, required: true, min: 0.1 },
    odometer: { type: Number, required: true, min: 0, default: 0 },
    acquisitionCost: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(VEHICLE_STATUS), default: VEHICLE_STATUS.AVAILABLE },
    mileage: { type: Number, required: true, min: 0, default: 0 },
    fuelType: { type: String, required: true, enum: ['petrol', 'diesel', 'electric', 'hybrid'] },
    capacity: { type: Number, required: true, min: 1 },
    lastMaintenanceDate: { type: Date },
    nextMaintenanceDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent odometer from decreasing
vehicleSchema.pre('save', function () {
  if (this.isModified('odometer')) {
    const original = (this as any)._original;
    if (original && this.odometer < original.odometer) {
      throw new Error('Odometer cannot decrease');
    }
  }
});

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
