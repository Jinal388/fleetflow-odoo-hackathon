import mongoose, { Document } from 'mongoose';
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
export declare const Driver: mongoose.Model<IDriver, {}, {}, {}, mongoose.Document<unknown, {}, IDriver, {}, mongoose.DefaultSchemaOptions> & IDriver & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDriver>;
//# sourceMappingURL=driver.model.d.ts.map