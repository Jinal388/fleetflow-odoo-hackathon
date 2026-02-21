import { Router } from 'express';
import { body } from 'express-validator';
import { MaintenanceController } from './maintenance.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { ROLES } from '../../config/constants';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  [
    body('vehicle').notEmpty().withMessage('Vehicle required'),
    body('type').isIn(['routine', 'repair', 'inspection', 'emergency']).withMessage('Invalid type'),
    body('description').notEmpty().withMessage('Description required'),
    body('scheduledDate').isISO8601().withMessage('Valid scheduled date required'),
    body('mileageAtService').isInt({ min: 0 }).withMessage('Valid mileage required'),
    validate,
  ],
  MaintenanceController.createMaintenance
);

router.get('/', MaintenanceController.getAllMaintenance);
router.get('/:id', MaintenanceController.getMaintenanceById);

router.patch(
  '/:id/complete',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  [body('cost').isFloat({ min: 0 }).withMessage('Valid cost required'), validate],
  MaintenanceController.completeMaintenance
);

router.patch(
  '/:id/cancel',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  MaintenanceController.cancelMaintenance
);

export default router;
