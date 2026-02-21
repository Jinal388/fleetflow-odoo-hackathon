import { Router } from 'express';
import { body } from 'express-validator';
import { DispatchController } from './dispatch.controller';
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
    body('origin').notEmpty().withMessage('Origin required'),
    body('destination').notEmpty().withMessage('Destination required'),
    body('scheduledDeparture').isISO8601().withMessage('Valid scheduled departure required'),
    body('scheduledArrival').isISO8601().withMessage('Valid scheduled arrival required'),
    body('purpose').notEmpty().withMessage('Purpose required'),
    validate,
  ],
  DispatchController.createDispatch
);

router.get('/', DispatchController.getAllDispatches);
router.get('/:id', DispatchController.getDispatchById);

router.patch(
  '/:id/approve',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  DispatchController.approveDispatch
);

router.patch(
  '/:id/start',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.DISPATCHER),
  DispatchController.startDispatch
);

router.patch(
  '/:id/complete',
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.DISPATCHER),
  DispatchController.completeDispatch
);

router.patch(
  '/:id/cancel',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  DispatchController.cancelDispatch
);

export default router;
