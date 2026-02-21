import { Router } from 'express';
import { body } from 'express-validator';
import { VehicleController } from './vehicle.controller';
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
    body('registrationNumber').notEmpty().withMessage('Registration number required'),
    body('make').notEmpty().withMessage('Make required'),
    body('vehicleModel').notEmpty().withMessage('Model required'),
    body('year').isInt({ min: 1900 }).withMessage('Valid year required'),
    body('fuelType').isIn(['petrol', 'diesel', 'electric', 'hybrid']).withMessage('Invalid fuel type'),
    body('capacity').isInt({ min: 1 }).withMessage('Valid capacity required'),
    validate,
  ],
  VehicleController.createVehicle
);

router.get('/', VehicleController.getAllVehicles);
router.get('/available', VehicleController.getAvailableVehicles);
router.get('/:id', VehicleController.getVehicleById);

router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  VehicleController.updateVehicle
);

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  VehicleController.deleteVehicle
);

export default router;
