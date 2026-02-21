import mongoose, { Document } from 'mongoose';
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
export declare const Maintenance: mongoose.Model<IMaintenance, {}, {}, {}, mongoose.Document<unknown, {}, IMaintenance, {}, mongoose.DefaultSchemaOptions> & IMaintenance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMaintenance>;
//# sourceMappingURL=maintenance.model.d.ts.map