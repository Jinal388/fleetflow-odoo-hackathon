import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { ROLES } from '../../config/constants';

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN, ROLES.MANAGER));

router.get('/fuel-efficiency', AnalyticsController.getFuelEfficiency);
router.get('/vehicle-roi', AnalyticsController.getVehicleROI);
router.get('/fleet-utilization', AnalyticsController.getFleetUtilization);
router.get('/operational-cost-summary', AnalyticsController.getOperationalCostSummary);
router.get('/cost-per-km', AnalyticsController.getCostPerKm);

export default router;
