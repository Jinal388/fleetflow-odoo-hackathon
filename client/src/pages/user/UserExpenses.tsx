import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Receipt, Search, Plus, Filter, X, Calculator } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

// --- Form Validation Schema ---
const expenseSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  fuelCost: z.string().min(1, 'Fuel Cost is required'),
  miscCost: z.string().min(0, 'Misc Cost is required'),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

const UserExpenses: React.FC = () => {
  const { expenses, addExpense, deleteExpense, trips, vehicles, drivers, maintenanceLogs } = useFleet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleForCost, setSelectedVehicleForCost] = useState<string>('');

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema)
  });

  const onSubmit = (data: ExpenseFormValues) => {
    const trip = trips.find(t => t.id === data.tripId);
    if (!trip) {
      setError('tripId', { type: 'manual', message: 'Trip ID not found. Enter an active Trip ID.' });
      return;
    }

    addExpense({
      id: "EXP-" + Math.floor(Math.random() * 10000),
      tripId: trip.id,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      distance: 'Auto-Calculated',
      fuelExpense: parseInt(data.fuelCost),
      miscExpense: parseInt(data.miscCost),
      status: 'Done'
    });
    setIsModalOpen(false);
    reset();
  };

  const getDriverName = (driverId: string) => {
    return drivers.find(d => d.id === driverId)?.name || driverId;
  };

  const calculateTotalOpCost = (vId: string) => {
    const fuelCost = expenses.filter(e => e.vehicleId === vId).reduce((acc, curr) => acc + curr.fuelExpense, 0);
    const maintCost = maintenanceLogs.filter(m => m.vehicleId === vId).reduce((acc, curr) => acc + curr.cost, 0);
    return fuelCost + maintCost;
  };

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
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} ({v.model})</option>)}
          </select>
          <div className="bg-muted px-4 py-2 rounded-lg font-mono font-semibold text-lg border border-border min-w-[150px] text-center">
            ₹ {selectedVehicleForCost ? calculateTotalOpCost(selectedVehicleForCost).toLocaleString() : '0'}
          </div>
        </div>
      </div>

      {/* Action Bar (Search & Filters) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Trip ID..."
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
            <Plus className="w-4 h-4" /> Add an Expense
          </button>
        </div>
      </div>

      {/* Expense Data Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Trip ID</th>
                <th className="px-4 py-3 font-medium">Driver</th>
                <th className="px-4 py-3 font-medium">Distance</th>
                <th className="px-4 py-3 font-medium">Fuel Exp (₹)</th>
                <th className="px-4 py-3 font-medium">Misc Exp (₹)</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">#{expense.tripId}</td>
                  <td className="px-4 py-3">{getDriverName(expense.driverId)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{expense.distance}</td>
                  <td className="px-4 py-3 font-mono">{expense.fuelExpense}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{expense.miscExpense}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${expense.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        expense.status === 'Pending Reimbursement' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No expenses recorded.
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /> New Expense</h3>
              <button onClick={() => { setIsModalOpen(false); reset(); }} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Active Trip</label>
                <select
                  {...register('tripId')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                >
                  <option value="">Select a trip...</option>
                  {trips.filter(t => t.status !== 'Delivered').map(t => <option key={t.id} value={t.id}>{t.id} ({t.origin} to {t.destination})</option>)}
                </select>
                {errors.tripId && <p className="text-xs text-destructive mt-1">{errors.tripId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fuel Cost (₹)</label>
                <input type="number" {...register('fuelCost')} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. 19000" />
                {errors.fuelCost && <p className="text-xs text-destructive mt-1">{errors.fuelCost.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Misc Expense (₹)</label>
                <input type="number" {...register('miscCost')} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. 3000" />
                {errors.miscCost && <p className="text-xs text-destructive mt-1">{errors.miscCost.message}</p>}
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
