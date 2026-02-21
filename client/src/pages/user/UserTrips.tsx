import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Route as RouteIcon, Search, Plus, Filter, ArrowUpDown, X, Settings2, Loader2 } from 'lucide-react';
import tripService, { type Trip } from '../../services/tripService';
import vehicleService, { type Vehicle } from '../../services/vehicleService';
import driverService, { type Driver } from '../../services/driverService';

// --- Form Validation Schema ---
const tripSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle selection is required'),
  cargoWeight: z.number().min(1, 'Cargo Weight is required'),
  driver: z.string().min(1, 'Driver selection is required'),
  origin: z.string().min(1, 'Origin Address is required'),
  destination: z.string().min(1, 'Destination Address is required'),
  revenue: z.number().min(1, 'Estimated Revenue is required'),
});

type TripFormValues = z.infer<typeof tripSchema>;

const UserTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema)
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripService.getAllTrips(),
        vehicleService.getAllVehicles(),
        driverService.getAllDrivers(),
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TripFormValues) => {
    try {
      const selectedVehicle = vehicles.find(v => v._id === data.vehicle);
      if (selectedVehicle && data.cargoWeight > selectedVehicle.maxPayload) {
        setError('cargoWeight', { 
          type: 'manual', 
          message: `Cargo exceeds max capacity of ${selectedVehicle.maxPayload}kg` 
        });
        return;
      }

      await tripService.createTrip({
        vehicle: data.vehicle,
        driver: data.driver,
        cargoWeight: data.cargoWeight,
        origin: data.origin,
        destination: data.destination,
        revenue: data.revenue,
        status: 'draft',
        createdBy: localStorage.getItem('userId') || '',
      });
      
      await fetchData();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await tripService.cancelTrip(id);
      await fetchData();
    } catch (error) {
      console.error('Failed to cancel trip:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dispatched':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">Dispatched</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">Draft</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-200">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">{status}</span>;
    }
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
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Origin</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Destination</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Cargo (kg)</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Revenue</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trips.map((trip) => (
                <tr key={trip._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-primary/80">{trip.origin}</td>
                  <td className="px-4 py-3 font-semibold text-primary/80">{trip.destination}</td>
                  <td className="px-4 py-3">{trip.cargoWeight}</td>
                  <td className="px-4 py-3">${trip.revenue}</td>
                  <td className="px-4 py-3">{getStatusBadge(trip.status)}</td>
                  <td className="px-4 py-3 text-right">
                    {trip.status === 'draft' && (
                      <button
                        onClick={() => handleDelete(trip._id!)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
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
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  >
                    <option value="">Choose an available vehicle...</option>
                    {vehicles.filter(v => v.status === 'idle').map(v => (
                      <option key={v._id} value={v._id}>{v.registrationNumber} - {v.model} (Max {v.maxPayload}kg)</option>
                    ))}
                  </select>
                  {errors.vehicle && <p className="text-xs text-destructive mt-1">{errors.vehicle.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Select Driver</label>
                  <select
                    {...register('driver')}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  >
                    <option value="">Assign an available driver...</option>
                    {drivers.filter(d => d.status === 'available').map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.driver && <p className="text-xs text-destructive mt-1">{errors.driver.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Cargo Weight (Kg)</label>
                <input
                  type="number"
                  {...register('cargoWeight', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 1500"
                />
                {errors.cargoWeight && <p className="text-xs text-destructive mt-1">{errors.cargoWeight.message}</p>}
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
                <label className="block text-sm font-medium mb-1 text-foreground">Estimated Revenue ($)</label>
                <input
                  type="number"
                  {...register('revenue', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 5000"
                />
                {errors.revenue && <p className="text-xs text-destructive mt-1">{errors.revenue.message}</p>}
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
                  Confirm & Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserTrips;
