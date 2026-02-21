# FleetFlow Backend

A modular fleet and logistics management system built with Node.js, TypeScript, Express, and MongoDB.

## Features

- **Vehicle Management**: Track vehicles, status, maintenance schedules
- **Driver Management**: Manage drivers, licenses, availability
- **Dispatch Workflow**: State-based dispatch system with approval workflow
- **Maintenance Tracking**: Schedule and track vehicle maintenance
- **Fuel Management**: Record fuel entries and track consumption
- **Role-Based Access Control**: Admin, Manager, Dispatcher roles
- **Analytics**: Operational insights and fuel statistics

## Architecture

```
src/
├── config/           # Configuration files and constants
├── models/           # Mongoose schemas
├── middlewares/      # Auth, validation, error handling
├── modules/          # Feature modules (controllers + routes)
├── services/         # Business logic layer
├── routes/           # Route aggregation
├── utils/            # Utilities (JWT, API responses)
└── server.ts         # Application entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fleetflow
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

4. Start MongoDB (ensure it's running)

5. Run development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Vehicles
- `POST /api/vehicles` - Create vehicle (Admin, Manager)
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/available` - Get available vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle (Admin, Manager)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin)

### Drivers
- `POST /api/drivers` - Create driver (Admin, Manager)
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/available` - Get available drivers
- `GET /api/drivers/:id` - Get driver by ID
- `PUT /api/drivers/:id` - Update driver (Admin, Manager)
- `DELETE /api/drivers/:id` - Delete driver (Admin)

### Dispatches
- `POST /api/dispatches` - Create dispatch
- `GET /api/dispatches` - Get all dispatches
- `GET /api/dispatches/:id` - Get dispatch by ID
- `PATCH /api/dispatches/:id/approve` - Approve dispatch (Admin, Manager)
- `PATCH /api/dispatches/:id/start` - Start dispatch
- `PATCH /api/dispatches/:id/complete` - Complete dispatch
- `PATCH /api/dispatches/:id/cancel` - Cancel dispatch (Admin, Manager)

### Maintenance
- `POST /api/maintenance` - Schedule maintenance (Admin, Manager)
- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/:id` - Get maintenance by ID
- `PATCH /api/maintenance/:id/complete` - Complete maintenance (Admin, Manager)
- `PATCH /api/maintenance/:id/cancel` - Cancel maintenance (Admin, Manager)

### Fuel
- `POST /api/fuel` - Create fuel entry
- `GET /api/fuel` - Get all fuel entries
- `GET /api/fuel/:id` - Get fuel entry by ID
- `GET /api/fuel/stats/vehicle/:vehicleId` - Get fuel stats by vehicle

## Roles & Permissions

### Admin
- Full system access
- User management
- Delete operations

### Manager
- Approve dispatches
- Manage vehicles and drivers
- Schedule maintenance
- View all records

### Dispatcher
- Create dispatches
- Start/complete dispatches
- Record fuel entries
- View operational data

## Workflow States

### Dispatch Workflow
1. **Pending** → Created, awaiting approval
2. **Approved** → Manager approved, ready to start
3. **In Progress** → Vehicle and driver assigned, en route
4. **Completed** → Trip finished
5. **Cancelled** → Dispatch cancelled

### Maintenance Workflow
1. **Scheduled** → Maintenance planned
2. **In Progress** → Work underway
3. **Completed** → Maintenance finished
4. **Cancelled** → Maintenance cancelled

## Business Rules

- Vehicles in maintenance cannot be dispatched
- Only available drivers can be assigned
- Dispatches require manager approval before starting
- Vehicle/driver status updates automatically during dispatch lifecycle
- Fuel entries update vehicle mileage

## Development

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Technologies

- Node.js & TypeScript
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation
- helmet & cors for security
