import mongoose, { Document, Schema } from 'mongoose';
import { DISPATCH_STATUS } from '../config/constants';

export interface IDispatch extends Document {
  vehicle: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  origin: string;
  destination: string;
  scheduledDeparture: Date;
  actualDeparture?: Date;
  scheduledArrival: Date;
  actualArrival?: Date;
  status: typeof DISPATCH_STATUS[keyof typeof DISPATCH_STATUS];
  distance?: number;
  purpose: string;
  notes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const dispatchSchema = new Schema<IDispatch>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    scheduledDeparture: { type: Date, required: true },
    actualDeparture: { type: Date },
    scheduledArrival: { type: Date, required: true },
    actualArrival: { type: Date },
    status: { type: String, enum: Object.values(DISPATCH_STATUS), default: DISPATCH_STATUS.PENDING },
    distance: { type: Number, min: 0 },
    purpose: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Dispatch = mongoose.model<IDispatch>('Dispatch', dispatchSchema);
