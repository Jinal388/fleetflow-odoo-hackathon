import React, { createContext, useContext, useState } from 'react';

export interface Vehicle {
    id: string;
    plate: string;
    model: string;
    type: string;
    capacity: number;
    odometer: string;
    status: 'Idle' | 'On Trip' | 'In Shop' | 'Out of Service';
}

export interface Driver {
    id: string;
    name: string;
    licenseNumber: string;
    licenseExpiry: string;
    safetyScore: number;
    status: 'On Duty' | 'Off Duty' | 'Suspended';
}

export interface Trip {
    id: string;
    vehicleId: string;
    driverId: string;
    fleetType: string;
    origin: string;
    destination: string;
    status: 'On way' | 'Pending' | 'Delivered';
}

export interface MaintenanceLog {
    id: string;
    vehicleId: string;
    issue: string;
    date: string;
    cost: number;
    status: 'New' | 'In Progress' | 'Completed';
}

export interface ExpenseLog {
    id: string;
    tripId: string;
    vehicleId: string;
    driverId: string;
    distance: string;
    fuelExpense: number;
    miscExpense: number;
    status: 'Done' | 'Pending Reimbursement' | 'Rejected';
}

interface FleetContextType {
    vehicles: Vehicle[];
    drivers: Driver[];
    trips: Trip[];
    maintenanceLogs: MaintenanceLog[];
    expenses: ExpenseLog[];
    addVehicle: (v: Vehicle) => void;
    updateVehicleStatus: (id: string, status: Vehicle['status']) => void;
    addDriver: (d: Driver) => void;
    updateDriverStatus: (id: string, status: Driver['status']) => void;
    addTrip: (t: Trip) => void;
    addMaintenanceLog: (m: MaintenanceLog) => void;
    addExpense: (e: ExpenseLog) => void;
    deleteVehicle: (id: string) => void;
    deleteDriver: (id: string) => void;
    deleteTrip: (id: string) => void;
    deleteMaintenanceLog: (id: string) => void;
    deleteExpense: (id: string) => void;
}

const initialVehicles: Vehicle[] = [
    { id: 'v1', plate: 'MH 00', model: '2017 Mini', type: 'Van', capacity: 500, odometer: '29000', status: 'Idle' },
    { id: 'v2', plate: 'KA 12', model: 'Ford Transit', type: 'Van', capacity: 3000, odometer: '45000', status: 'On Trip' },
    { id: 'v3', plate: 'DL 9C', model: 'Volvo FH', type: 'Truck', capacity: 20000, odometer: '120500', status: 'In Shop' },
    { id: 'v4', plate: 'TN 15', model: 'Mahindra Bolero', type: 'Pickup', capacity: 1500, odometer: '10000', status: 'Idle' }
];

const initialDrivers: Driver[] = [
    { id: 'd1', name: 'Alex Johnson', licenseNumber: 'DL-19283-X', licenseExpiry: '2026-12-01', safetyScore: 98, status: 'On Duty' },
    { id: 'd2', name: 'Sarah Connor', licenseNumber: 'DL-88219-Y', licenseExpiry: '2026-02-23', safetyScore: 85, status: 'Off Duty' },
    { id: 'd3', name: 'Michael Chen', licenseNumber: 'DL-33921-Z', licenseExpiry: '2024-05-12', safetyScore: 60, status: 'Suspended' },
];

const initialTrips: Trip[] = [
    { id: 'TRP-1042', vehicleId: 'v2', driverId: 'd1', fleetType: 'Van', origin: 'Mumbai', destination: 'Pune', status: 'On way' },
    { id: 'TRP-1043', vehicleId: 'v1', driverId: 'd2', fleetType: 'Van', origin: 'Delhi', destination: 'Agra', status: 'Pending' },
];

const initialMaintenance: MaintenanceLog[] = [
    { id: '321', vehicleId: 'v1', issue: 'Engine Issue', date: '20/02/2026', cost: 10000, status: 'New' },
    { id: '322', vehicleId: 'v2', issue: 'Oil Change', date: '18/02/2026', cost: 2500, status: 'Completed' },
    { id: '323', vehicleId: 'v3', issue: 'Brake Replacement', date: '21/02/2026', cost: 15000, status: 'In Progress' },
];

const initialExpenses: ExpenseLog[] = [
    { id: 'EXP-1', tripId: 'TRP-1042', vehicleId: 'v2', driverId: 'd1', distance: '1000 km', fuelExpense: 19000, miscExpense: 3000, status: 'Done' },
];

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
    const [trips, setTrips] = useState<Trip[]>(initialTrips);
    const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(initialMaintenance);
    const [expenses, setExpenses] = useState<ExpenseLog[]>(initialExpenses);

    const addVehicle = (v: Vehicle) => setVehicles(prev => [v, ...prev]);
    const updateVehicleStatus = (id: string, status: Vehicle['status']) =>
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    const deleteVehicle = (id: string) => setVehicles(prev => prev.filter(v => v.id !== id));

    const addDriver = (d: Driver) => setDrivers(prev => [d, ...prev]);
    const updateDriverStatus = (id: string, status: Driver['status']) =>
        setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const deleteDriver = (id: string) => setDrivers(prev => prev.filter(d => d.id !== id));

    const addTrip = (t: Trip) => {
        setTrips(prev => [t, ...prev]);
        updateVehicleStatus(t.vehicleId, 'On Trip');
    };
    const deleteTrip = (id: string) => setTrips(prev => prev.filter(t => t.id !== id));

    const addMaintenanceLog = (m: MaintenanceLog) => {
        setMaintenanceLogs(prev => [m, ...prev]);
        updateVehicleStatus(m.vehicleId, 'In Shop');
    };
    const deleteMaintenanceLog = (id: string) => setMaintenanceLogs(prev => prev.filter(m => m.id !== id));

    const addExpense = (e: ExpenseLog) => setExpenses(prev => [e, ...prev]);
    const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

    return (
        <FleetContext.Provider value={{
            vehicles, drivers, trips, maintenanceLogs, expenses,
            addVehicle, updateVehicleStatus, deleteVehicle,
            addDriver, updateDriverStatus, deleteDriver,
            addTrip, deleteTrip,
            addMaintenanceLog, deleteMaintenanceLog,
            addExpense, deleteExpense
        }}>
            {children}
        </FleetContext.Provider>
    );
};

export const useFleet = () => {
    const context = useContext(FleetContext);
    if (!context) throw new Error("useFleet must be used within a FleetProvider");
    return context;
};
