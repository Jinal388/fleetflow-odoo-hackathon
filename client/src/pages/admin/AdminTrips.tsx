import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Route as RouteIcon, Search, Plus, Filter, ArrowUpDown, X, Settings2 } from 'lucide-react';

// --- Mock Data ---
interface Trip {
  id: string;
  fleetType: string;
  origin: string;
  destination: string;
  status: 'On way' | 'Pending' | 'Delivered';
}

const initialTrips: Trip[] = [
  { id: '1', fleetType: 'Trailer Truck', origin: 'Mumbai', destination: 'Pune', status: 'On way' },
  { id: '2', fleetType: 'Van', origin: 'Delhi', destination: 'Agra', status: 'Pending' },
  { id: '3', fleetType: 'Pickup', origin: 'Chennai', destination: 'Bangalore', status: 'Delivered' },
];

const mockVehicles = [
  { id: 'v1', label: 'MH 00 - 2017 Mini', capacity: 500, status: 'Idle' },
  { id: 'v2', label: 'KA 12 - Ford Transit', capacity: 3000, status: 'On Trip' },
  { id: 'v3', label: 'DL 9C - Volvo FH', capacity: 20000, status: 'In Shop' },
  { id: 'v4', label: 'TN 15 - Mahindra Bolero', capacity: 1500, status: 'Idle' }
];

const mockDrivers = [
  { id: 'd1', name: 'John Doe', status: 'On Duty' },
  { id: 'd2', name: 'Jane Smith', status: 'Off Duty' },
  { id: 'd3', name: 'Mike Johnson', status: 'Suspended' },
  { id: 'd4', name: 'Alex Johnson', status: 'On Duty' }
];

// --- Form Validation Schema ---
const tripSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle selection is required'),
  weight: z.string().min(1, 'Cargo Weight is required'),
  driver: z.string().min(1, 'Driver selection is required'),
  origin: z.string().min(1, 'Origin Address is required'),
  destination: z.string().min(1, 'Destination Address is required'),
  estimatedCost: z.string().min(1, 'Estimated Fuel Cost is required'),
});

type TripFormValues = z.infer<typeof tripSchema>;

const AdminTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema)
  });

  const onSubmit = (data: TripFormValues) => {
    const selectedVehicle = mockVehicles.find(v => v.id === data.vehicle);
    if (selectedVehicle && parseInt(data.weight) > selectedVehicle.capacity) {
      setError('weight', { type: 'manual', message: `Cargo exceeds max capacity of ${selectedVehicle.capacity}kg` });
      return;
    }

    const fleetType = selectedVehicle?.label.includes('Mini') ? 'Van' : selectedVehicle?.label.includes('Transit') ? 'Van' : 'Truck';

    const newTrip: Trip = {
      id: Math.random().toString(),
      fleetType: fleetType,
      origin: data.origin,
      destination: data.destination,
      status: 'Pending'
    };
    setTrips([...trips, newTrip]);
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="p-6">

      {/* Header section matching Dashboard style */}
      <div className="flex items-center gap-3 mb-8 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <RouteIcon className="text-amber-500 w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Trip Dispatcher</h1>
          <p className="text-sm text-muted-foreground">The brain of the operation. Setup deliveries and move cargo.</p>
        </div>
      </div>

      {/* Action Bar (Search & Filters) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search active trips..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Group by
          </button>
          <button className="px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Filter
          </button>
          <button className="px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Sort by
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>
      </div>

      {/* Trips Data Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">ID</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Fleet Type</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Origin</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Destination</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trips.map((trip, index) => (
                <tr key={trip.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground font-mono">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{trip.fleetType}</td>
                  <td className="px-4 py-3 font-semibold text-primary/80">{trip.origin}</td>
                  <td className="px-4 py-3 font-semibold text-primary/80">{trip.destination}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                      ${trip.status === 'On way' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        trip.status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setTrips(trips.filter(item => item.id !== trip.id))}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trips.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No active trips found. Click "New Trip" to dispatch a vehicle.
            </div>
          )}
        </div>
      </div>

      {/* New Trip Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <RouteIcon className="w-5 h-5 text-primary" />
                New Trip Dispatch Form
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors bg-background p-1.5 rounded-md border border-border hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Select Vehicle</label>
                  <select
                    {...register('vehicle')}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none bg-no-repeat"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="">Choose an available vehicle...</option>
                    {mockVehicles.filter(v => v.status === 'Idle').map(v => (
                      <option key={v.id} value={v.id}>{v.label} (Max {v.capacity}kg)</option>
                    ))}
                  </select>
                  {errors.vehicle && <p className="text-xs text-destructive mt-1">{errors.vehicle.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Select Driver</label>
                  <select
                    {...register('driver')}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none bg-no-repeat"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="">Assign an available driver...</option>
                    {mockDrivers.filter(d => d.status === 'On Duty').map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.driver && <p className="text-xs text-destructive mt-1">{errors.driver.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Cargo Weight (Kg)</label>
                <input
                  type="number"
                  {...register('weight')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 1500"
                />
                {errors.weight && <p className="text-xs text-destructive mt-1">{errors.weight.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Origin Address</label>
                <input
                  type="text"
                  {...register('origin')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. Warehouse A, Mumbai"
                />
                {errors.origin && <p className="text-xs text-destructive mt-1">{errors.origin.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Destination Address</label>
                <input
                  type="text"
                  {...register('destination')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. Distribution Center, Pune"
                />
                {errors.destination && <p className="text-xs text-destructive mt-1">{errors.destination.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Estimated Fuel Cost (₹)</label>
                <input
                  type="number"
                  {...register('estimatedCost')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 5000"
                />
                {errors.estimatedCost && <p className="text-xs text-destructive mt-1">{errors.estimatedCost.message}</p>}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-sm"
                >
                  Confirm & Dispatch Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTrips;
