export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DISPATCHER: 'dispatcher',
} as const;

export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  ON_TRIP: 'on_trip',
  IN_SHOP: 'in_shop',
  OUT_OF_SERVICE: 'out_of_service',
} as const;

export const DRIVER_STATUS = {
  ON_DUTY: 'on_duty',
  OFF_DUTY: 'off_duty',
  ON_TRIP: 'on_trip',
  SUSPENDED: 'suspended',
  ON_LEAVE: 'on_leave',
} as const;

export const TRIP_STATUS = {
  DRAFT: 'draft',
  DISPATCHED: 'dispatched',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const DISPATCH_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const MAINTENANCE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const FUEL_ENTRY_TYPE = {
  REFUEL: 'refuel',
  CONSUMPTION: 'consumption',
} as const;
