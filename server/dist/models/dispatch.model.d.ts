import mongoose, { Document } from 'mongoose';
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
export declare const Dispatch: mongoose.Model<IDispatch, {}, {}, {}, mongoose.Document<unknown, {}, IDispatch, {}, mongoose.DefaultSchemaOptions> & IDispatch & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDispatch>;
//# sourceMappingURL=dispatch.model.d.ts.map