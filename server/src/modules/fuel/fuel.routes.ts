import { Router } from 'express';
import { body } from 'express-validator';
import { FuelController } from './fuel.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { ROLES } from '../../config/constants';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.DISPATCHER),
  [
    body('vehicle').notEmpty().withMessage('Vehicle required'),
    body('driver').notEmpty().withMessage('Driver required'),
    body('quantity').isFloat({ min: 0 }).withMessage('Valid quantity required'),
    body('cost').isFloat({ min: 0 }).withMessage('Valid cost required'),
    body('pricePerUnit').isFloat({ min: 0 }).withMessage('Valid price per unit required'),
    body('mileage').isInt({ min: 0 }).withMessage('Valid mileage required'),
    validate,
  ],
  FuelController.createFuelEntry
);

router.get('/', FuelController.getAllFuelEntries);
router.get('/:id', FuelController.getFuelEntryById);
router.get('/stats/vehicle/:vehicleId', FuelController.getFuelStatsByVehicle);

export default router;
