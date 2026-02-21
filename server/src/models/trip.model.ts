import mongoose, { Document, Schema } from 'mongoose';
import { TRIP_STATUS } from '../config/constants';

export interface ITrip extends Document {
  vehicle: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  cargoWeight: number;
  origin: string;
  destination: string;
  revenue: number;
  status: typeof TRIP_STATUS[keyof typeof TRIP_STATUS];
  startOdometer: number;
  endOdometer?: number;
  distance?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  canTransitionTo(newStatus: string): boolean;
  calculateDistance(): number;
}

const tripSchema = new Schema<ITrip>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
    cargoWeight: { type: Number, required: true, min: 0 },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    revenue: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: Object.values(TRIP_STATUS), default: TRIP_STATUS.DRAFT, index: true },
    startOdometer: { type: Number, min: 0 },
    endOdometer: { type: Number, min: 0 },
    distance: { type: Number, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// State machine validation
tripSchema.methods.canTransitionTo = function (newStatus: string): boolean {
  const transitions: Record<string, string[]> = {
    [TRIP_STATUS.DRAFT]: [TRIP_STATUS.DISPATCHED, TRIP_STATUS.CANCELLED],
    [TRIP_STATUS.DISPATCHED]: [TRIP_STATUS.COMPLETED, TRIP_STATUS.CANCELLED],
    [TRIP_STATUS.COMPLETED]: [],
    [TRIP_STATUS.CANCELLED]: [],
  };

  return transitions[this.status]?.includes(newStatus) || false;
};

tripSchema.methods.calculateDistance = function (): number {
  if (this.endOdometer && this.startOdometer) {
    return this.endOdometer - this.startOdometer;
  }
  return 0;
};

// Validate endOdometer >= startOdometer
tripSchema.pre('save', function () {
  if (this.endOdometer && this.startOdometer && this.endOdometer < this.startOdometer) {
    throw new Error('End odometer must be greater than or equal to start odometer');
  }
});

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);
