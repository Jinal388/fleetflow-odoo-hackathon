import mongoose, { Document, Schema } from 'mongoose';
import { DRIVER_STATUS } from '../config/constants';

export interface IDriver extends Document {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  licenseExpiryDate: Date;
  phone: string;
  email?: string;
  status: typeof DRIVER_STATUS[keyof typeof DRIVER_STATUS];
  safetyScore: number;
  totalTrips: number;
  completedTrips: number;
  assignedVehicle?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isLicenseValid(): boolean;
  canBeAssigned(): boolean;
}

const driverSchema = new Schema<IDriver>(
  {
    name: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    licenseCategory: { type: String, required: true, trim: true },
    licenseExpiry: { type: Date, required: true },
    licenseExpiryDate: { type: Date, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    status: { type: String, enum: Object.values(DRIVER_STATUS), default: DRIVER_STATUS.OFF_DUTY },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 },
    totalTrips: { type: Number, default: 0, min: 0 },
    completedTrips: { type: Number, default: 0, min: 0 },
    assignedVehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

driverSchema.methods.isLicenseValid = function (): boolean {
  return new Date() < this.licenseExpiryDate;
};

driverSchema.methods.canBeAssigned = function (): boolean {
  return (
    this.isActive &&
    this.isLicenseValid() &&
    this.status === DRIVER_STATUS.ON_DUTY &&
    this.status !== DRIVER_STATUS.SUSPENDED
  );
};

export const Driver = mongoose.model<IDriver>('Driver', driverSchema);
