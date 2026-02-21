import { Router } from 'express';
import { body } from 'express-validator';
import { DriverController } from './driver.controller';
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
    body('name').notEmpty().withMessage('Name required'),
    body('licenseNumber').notEmpty().withMessage('License number required'),
    body('licenseExpiry').isISO8601().withMessage('Valid license expiry date required'),
    body('phone').notEmpty().withMessage('Phone required'),
    validate,
  ],
  DriverController.createDriver
);

router.get('/', DriverController.getAllDrivers);
router.get('/available', DriverController.getAvailableDrivers);
router.get('/:id', DriverController.getDriverById);

router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  DriverController.updateDriver
);

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  DriverController.deleteDriver
);

export default router;
