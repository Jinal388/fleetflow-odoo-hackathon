# FleetFlow - Complete Fleet Management System

A modern, full-stack fleet and logistics management system built with React, TypeScript, Node.js, Express, and MongoDB.

## 🌟 Features

### Authentication & Security
- ✅ Email verification with OTP (6-digit, 10-min expiry)
- ✅ Password reset with OTP
- ✅ JWT authentication (1-day expiry)
- ✅ Role-based access control (Admin, Manager, Dispatcher)
- ✅ Admin accounts only via database seeding (security)

### Vehicle Management
- ✅ Complete CRUD operations
- ✅ Status tracking (available, on_trip, in_shop, out_of_service)
- ✅ Odometer validation (cannot decrease)
- ✅ Capacity and load tracking
- ✅ Acquisition cost for ROI calculations

### Driver Management
- ✅ License compliance tracking
- ✅ License expiry validation
- ✅ Safety score (0-100)
- ✅ Trip statistics (total, completed)
- ✅ Status management (on_duty, off_duty, on_trip, suspended)

### Trip Management (State Machine)
- ✅ State machine: DRAFT → DISPATCHED → COMPLETED
- ✅ MongoDB transactions for atomicity
- ✅ Resource locking (vehicle & driver)
- ✅ Cargo weight validation
- ✅ License expiry checks
- ✅ Odometer tracking
- ✅ Distance calculation

### Maintenance Management
- ✅ Schedule maintenance (vehicle → in_shop)
- ✅ Prevents dispatch during maintenance
- ✅ Cost tracking
- ✅ Service provider tracking
- ✅ Automatic status updates

### Fuel Tracking
- ✅ Fuel entry recording
- ✅ Cost tracking
- ✅ Automatic mileage updates
- ✅ Vehicle-based statistics

### Analytics Dashboard
- ✅ Fuel efficiency (distance/fuel)
- ✅ Vehicle ROI calculations
- ✅ Fleet utilization metrics
- ✅ Operational cost summaries
- ✅ Cost per km analysis
- ✅ Date range filtering

## 🏗️ Architecture

### Backend (Node.js + TypeScript + Express + MongoDB)
```
server/
├── src/
│   ├── config/           # Constants and database config
│   ├── models/           # Mongoose schemas (7 models)
│   ├── middlewares/      # Auth, validation, error handling
│   ├── modules/          # Feature modules (8 modules)
│   ├── services/         # Business logic layer
│   ├── routes/           # Route aggregation
│   ├── utils/            # Utilities (JWT, API responses, email)
│   └── scripts/          # Database seeding
└── server.ts             # Application entry point
```

### Frontend (React + TypeScript + Vite + TailwindCSS)
```
client/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── user/         # User pages
│   │   └── home/         # Landing page
│   ├── services/         # API integration layer
│   ├── context/          # State management
│   ├── routes/           # Route configuration
│   └── lib/              # Utilities (axios config)
└── App.tsx               # Application root
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

### 1. Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd fleetflow-odoo-hackathon

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

**Backend (.env):**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fleetflow
JWT_SECRET=fleetflow-secret-key-change-in-production-2024
JWT_EXPIRES_IN=1d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start MongoDB
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 4. Seed Database
```bash
cd server
npm run seed
```

**Creates:**
- Admin: admin@fleetflow.com / Admin@123
- Manager: manager@fleetflow.com / Manager@123
- Dispatcher: dispatcher@fleetflow.com / Dispatcher@123
- 3 vehicles
- 3 drivers

### 5. Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Runs on: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Runs on: `http://localhost:5173`

### 6. Access Application
Open browser: `http://localhost:5173`

Login with:
- Email: `admin@fleetflow.com`
- Password: `Admin@123`

## 📊 API Endpoints

### Authentication (6 endpoints)
- POST `/api/auth/register` - Register user
- POST `/api/auth/verify-email` - Verify email with OTP
- POST `/api/auth/login` - Login
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password
- POST `/api/auth/resend-verification` - Resend OTP

### Vehicles (6 endpoints)
- GET/POST `/api/vehicles`
- GET `/api/vehicles/available`
- GET/PUT/DELETE `/api/vehicles/:id`

### Drivers (6 endpoints)
- GET/POST `/api/drivers`
- GET `/api/drivers/available`
- GET/PUT/DELETE `/api/drivers/:id`

### Trips (9 endpoints)
- GET/POST `/api/trips`
- GET `/api/trips/active`
- PATCH `/api/trips/:id/dispatch`
- PATCH `/api/trips/:id/complete`
- PATCH `/api/trips/:id/cancel`

### Maintenance (5 endpoints)
- GET/POST `/api/maintenance`
- PATCH `/api/maintenance/:id/complete`
- PATCH `/api/maintenance/:id/cancel`

### Fuel (4 endpoints)
- GET/POST `/api/fuel`
- GET `/api/fuel/stats/vehicle/:id`

### Analytics (5 endpoints)
- GET `/api/analytics/fuel-efficiency`
- GET `/api/analytics/vehicle-roi`
- GET `/api/analytics/fleet-utilization`
- GET `/api/analytics/operational-cost-summary`
- GET `/api/analytics/cost-per-km`

**Total: 50+ API endpoints**

## 🔐 Security Features

- Password hashing (bcrypt, 12 rounds)
- JWT authentication with expiry
- OTP-based email verification
- Role-based access control
- Admin creation restricted to seed script
- Input validation on all endpoints
- MongoDB transactions for atomicity
- CORS configuration
- Helmet security headers

## 🎯 Role Permissions

| Feature | Admin | Manager | Dispatcher |
|---------|-------|---------|------------|
| Create Admin | ❌ Seed Only | ❌ | ❌ |
| Create Manager | ✅ | ❌ | ❌ |
| Delete Resources | ✅ | ❌ | ❌ |
| Approve Trips | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ❌ |
| Create Trips | ✅ | ✅ | ✅ |
| Complete Trips | ✅ | ✅ | ✅ |

## 📚 Documentation

- **SETUP_INSTRUCTIONS.md** - Quick setup guide
- **INTEGRATION_TESTING_GUIDE.md** - Complete testing checklist
- **server/README.md** - Backend documentation
- **server/ADMIN_SETUP.md** - Admin account setup
- **server/SECURITY_SUMMARY.md** - Security implementation
- **server/ENHANCED_FEATURES.md** - Feature documentation
- **server/QUICK_REFERENCE.md** - API quick reference
- **server/ARCHITECTURE.md** - System architecture

## 🧪 Testing

See **INTEGRATION_TESTING_GUIDE.md** for:
- Complete testing checklist
- Phase-by-phase testing
- Edge case testing
- Integration testing
- Common issues & solutions

## 🚀 Production Deployment

### Backend
1. Update environment variables
2. Change JWT_SECRET
3. Configure production MongoDB
4. Set up SMTP for emails
5. Build: `npm run build`
6. Deploy to hosting (Heroku, AWS, etc.)

### Frontend
1. Update API URL in .env
2. Build: `npm run build`
3. Deploy dist folder (Vercel, Netlify, etc.)

## 🛠️ Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- nodemailer
- express-validator

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Axios
- React Hook Form
- Zod
- Lucide React (icons)
- Recharts (analytics)

## 📈 Key Features

### State Machine
- Strict state transitions
- Validation at each step
- Atomic operations with transactions
- Resource locking/unlocking
- Automatic rollback on failure

### Business Rules
- Cargo weight ≤ vehicle capacity
- Vehicle must be available
- Driver license must be valid
- Odometer cannot decrease
- Cannot delete vehicle with active trips
- Cannot dispatch vehicle in maintenance

### Analytics
- Fuel efficiency per vehicle
- ROI calculations
- Fleet utilization rate
- Operational cost trends
- Cost per km analysis

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License

## 👥 Authors

FleetFlow Team

## 🙏 Acknowledgments

- Built for Odoo Hackathon
- Modern fleet management solution
- Enterprise-grade architecture

---

**FleetFlow** - Modernizing fleet management, one trip at a time. 🚚✨
