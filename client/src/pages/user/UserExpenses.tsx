import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Receipt, Search, Plus, Filter, X, Calculator, Loader2 } from 'lucide-react';
import fuelService, { type FuelEntry } from '../../services/fuelService';
import vehicleService, { type Vehicle } from '../../services/vehicleService';
import driverService, { type Driver } from '../../services/driverService';
import maintenanceService, { type Maintenance } from '../../services/maintenanceService';

// --- Form Validation Schema ---
const expenseSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle is required'),
  driver: z.string().min(1, 'Driver is required'),
  quantity: z.number().min(1, 'Fuel quantity is required'),
  cost: z.number().min(1, 'Fuel cost is required'),
  mileage: z.number().min(0, 'Mileage is required'),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

const UserExpenses: React.FC = () => {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<Maintenance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleForCost, setSelectedVehicleForCost] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema)
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fuelData, vehiclesData, driversData, maintenanceData] = await Promise.all([
        fuelService.getAllFuelEntries(),
        vehicleService.getAllVehicles(),
        driverService.getAllDrivers(),
        maintenanceService.getAllMaintenance(),
      ]);
      setFuelEntries(fuelData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
      setMaintenanceLogs(maintenanceData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      await fuelService.createFuelEntry({
        vehicle: data.vehicle,
        driver: data.driver,
        type: 'refuel',
        quantity: data.quantity,
        cost: data.cost,
        pricePerUnit: data.cost / data.quantity,
        mileage: data.mileage,
        date: new Date(data.date),
        createdBy: localStorage.getItem('userId') || '',
      });
      await fetchData();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create fuel entry:', error);
    }
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d._id === driverId);
    return driver?.name || driverId;
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    return vehicle ? `${vehicle.registrationNumber}` : vehicleId;
  };

  const calculateTotalOpCost = (vId: string) => {
    const fuelCost = fuelEntries.filter(e => e.vehicle === vId).reduce((acc, curr) => acc + curr.cost, 0);
    const maintCost = maintenanceLogs.filter(m => m.vehicle === vId).reduce((acc, curr) => acc + (curr.cost || 0), 0);
    return fuelCost + maintCost;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header section matching Dashboard style */}
      <div className="flex items-center gap-3 mb-8 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Receipt className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Expense & Fuel Logging</h1>
          <p className="text-sm text-muted-foreground">The digital wallet for your fleet. Track costs per trip and vehicle.</p>
        </div>
      </div>

      {/* Analytics & Op Cost Block */}
      <div className="bg-card border border-border rounded-xl p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Calculator className="w-5 h-5 text-amber-500" /> Total Operational Cost per Vehicle</h3>
          <p className="text-sm text-muted-foreground mt-1">Calculates cumulative fuel and maintenance costs.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            className="px-3 py-2 bg-background border border-input rounded-md text-sm min-w-[200px]"
            value={selectedVehicleForCost}
            onChange={(e) => setSelectedVehicleForCost(e.target.value)}
          >
            <option value="">Select a vehicle...</option>
            {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} ({v.model})</option>)}
          </select>
          <div className="bg-muted px-4 py-2 rounded-lg font-mono font-semibold text-lg border border-border min-w-[150px] text-center">
            $ {selectedVehicleForCost ? calculateTotalOpCost(selectedVehicleForCost).toLocaleString() : '0'}
          </div>
        </div>
      </div>

      {/* Action Bar (Search & Filters) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Group by
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Fuel Entry
          </button>
        </div>
      </div>

      {/* Expense Data Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Driver</th>
                <th className="px-4 py-3 font-medium">Quantity (L)</th>
                <th className="px-4 py-3 font-medium">Cost ($)</th>
                <th className="px-4 py-3 font-medium">Mileage</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fuelEntries.map((entry) => (
                <tr key={entry._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{getVehicleName(entry.vehicle)}</td>
                  <td className="px-4 py-3">{getDriverName(entry.driver)}</td>
                  <td className="px-4 py-3 font-mono">{entry.quantity}</td>
                  <td className="px-4 py-3 font-mono">{entry.cost}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.mileage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {fuelEntries.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No fuel entries recorded.
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /> New Fuel Entry</h3>
              <button onClick={() => { setIsModalOpen(false); reset(); }} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle</label>
                <select
                  {...register('vehicle')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                >
                  <option value="">Select a vehicle...</option>
                  {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} - {v.model}</option>)}
                </select>
                {errors.vehicle && <p className="text-xs text-destructive mt-1">{errors.vehicle.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Driver</label>
                <select
                  {...register('driver')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                >
                  <option value="">Select a driver...</option>
                  {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                {errors.driver && <p className="text-xs text-destructive mt-1">{errors.driver.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fuel Quantity (Liters)</label>
                <input type="number" {...register('quantity', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. 50" />
                {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fuel Cost ($)</label>
                <input type="number" {...register('cost', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. 100" />
                {errors.cost && <p className="text-xs text-destructive mt-1">{errors.cost.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                <input type="number" {...register('mileage', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. 50000" />
                {errors.mileage && <p className="text-xs text-destructive mt-1">{errors.mileage.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" {...register('date')} className="w-full px-3 py-2 border rounded-md text-sm" />
                {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="w-1/2 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">Create</button>
                <button type="button" onClick={() => { setIsModalOpen(false); reset(); }} className="w-1/2 py-2 text-sm font-medium border text-destructive rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserExpenses;
