import mongoose, { Document, Schema } from 'mongoose';
import { FUEL_ENTRY_TYPE } from '../config/constants';

export interface IFuel extends Document {
  vehicle: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  type: typeof FUEL_ENTRY_TYPE[keyof typeof FUEL_ENTRY_TYPE];
  quantity: number;
  cost: number;
  pricePerUnit: number;
  mileage: number;
  date: Date;
  location?: string;
  receiptNumber?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const fuelSchema = new Schema<IFuel>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    type: { type: String, enum: Object.values(FUEL_ENTRY_TYPE), default: FUEL_ENTRY_TYPE.REFUEL },
    quantity: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    pricePerUnit: { type: Number, required: true, min: 0 },
    mileage: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    location: { type: String, trim: true },
    receiptNumber: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Fuel = mongoose.model<IFuel>('Fuel', fuelSchema);
