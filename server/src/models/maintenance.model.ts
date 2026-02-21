import mongoose, { Document, Schema } from 'mongoose';
import { MAINTENANCE_STATUS } from '../config/constants';

export interface IMaintenance extends Document {
  vehicle: mongoose.Types.ObjectId;
  type: string;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: typeof MAINTENANCE_STATUS[keyof typeof MAINTENANCE_STATUS];
  cost?: number;
  serviceProvider?: string;
  mileageAtService: number;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceSchema = new Schema<IMaintenance>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: { type: String, required: true, enum: ['routine', 'repair', 'inspection', 'emergency'], trim: true },
    description: { type: String, required: true, trim: true },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: { type: String, enum: Object.values(MAINTENANCE_STATUS), default: MAINTENANCE_STATUS.SCHEDULED },
    cost: { type: Number, min: 0 },
    serviceProvider: { type: String, trim: true },
    mileageAtService: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Maintenance = mongoose.model<IMaintenance>('Maintenance', maintenanceSchema);
