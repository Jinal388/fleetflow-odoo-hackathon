import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import vehicleRoutes from '../modules/vehicles/vehicle.routes';
import driverRoutes from '../modules/drivers/driver.routes';
import dispatchRoutes from '../modules/dispatches/dispatch.routes';
import maintenanceRoutes from '../modules/maintenance/maintenance.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/dispatches', dispatchRoutes);
router.use('/maintenance', maintenanceRoutes);


export default router;
