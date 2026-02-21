import mongoose, { Document } from 'mongoose';
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
export declare const Vehicle: mongoose.Model<IVehicle, {}, {}, {}, mongoose.Document<unknown, {}, IVehicle, {}, mongoose.DefaultSchemaOptions> & IVehicle & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVehicle>;
//# sourceMappingURL=vehicle.model.d.ts.map