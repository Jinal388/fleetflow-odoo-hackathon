import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import vehicleRoutes from '../modules/vehicles/vehicle.routes';
import driverRoutes from '../modules/drivers/driver.routes';
import dispatchRoutes from '../modules/dispatches/dispatch.routes';
import maintenanceRoutes from '../modules/maintenance/maintenance.routes';
import fuelRoutes from '../modules/fuel/fuel.routes';
import tripRoutes from '../modules/trips/trip.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/dispatches', dispatchRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/fuel', fuelRoutes);
router.use('/trips', tripRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
