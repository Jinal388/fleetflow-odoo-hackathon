import { Router } from 'express';
import { body } from 'express-validator';
import { TripController } from './trip.controller';
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
    body('cargoWeight').isFloat({ min: 0 }).withMessage('Valid cargo weight required'),
    body('origin').notEmpty().withMessage('Origin required'),
    body('destination').notEmpty().withMessage('Destination required'),
    body('revenue').isFloat({ min: 0 }).withMessage('Valid revenue required'),
    validate,
  ],
  TripController.createTrip
);

router.get('/', TripController.getAllTrips);
router.get('/active', TripController.getActiveTrips);
router.get('/:id', TripController.getTripById);
router.get('/vehicle/:vehicleId', TripController.getTripsByVehicle);
router.get('/driver/:driverId', TripController.getTripsByDriver);

router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.DISPATCHER),
  TripController.updateTrip
);

router.patch(
  '/:id/dispatch',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.DISPATCHER),
  TripController.dispatchTrip
);

router.patch(
  '/:id/complete',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.DISPATCHER),
  [
    body('endOdometer').isFloat({ min: 0 }).withMessage('Valid end odometer required'),
    validate,
  ],
  TripController.completeTrip
);

router.patch(
  '/:id/cancel',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  TripController.cancelTrip
);

export default router;
