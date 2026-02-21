import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car, Search, Plus, Filter, ArrowUpDown, X, Settings2, Loader2 } from 'lucide-react';
import vehicleService, { type Vehicle } from '../../services/vehicleService';

// --- Form Validation Schema ---
const vehicleSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration Number is required'),
  maxPayload: z.number().min(1, 'Max Payload is required'),
  currentOdometer: z.number().min(0, 'Current Odometer is required'),
  vehicleType: z.string().min(1, 'Type is required'),
  model: z.string().min(1, 'Model is required'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const UserVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema)
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      await vehicleService.createVehicle({
        registrationNumber: data.registrationNumber,
        vehicleType: data.vehicleType,
        model: data.model,
        maxPayload: data.maxPayload,
        currentOdometer: data.currentOdometer,
        status: 'idle',
      });
      await fetchVehicles();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create vehicle:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleService.deleteVehicle(id);
      await fetchVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const handleStatusToggle = async (vehicle: Vehicle) => {
    try {
      const newStatus = vehicle.status === 'out_of_service' ? 'idle' : 'out_of_service';
      await vehicleService.updateVehicle(vehicle._id, { status: newStatus });
      await fetchVehicles();
    } catch (error) {
      console.error('Failed to update vehicle status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'idle':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">Idle</span>;
      case 'on_trip':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">On Trip</span>;
      case 'in_maintenance':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-rose-50 text-rose-700 border-rose-200">In Maintenance</span>;
      case 'out_of_service':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-300">Out of Service</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-300">{status}</span>;
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
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Car className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Vehicle Registry</h1>
          <p className="text-sm text-muted-foreground">Digital garage representing your assets.</p>
        </div>
      </div>

      {/* Action Bar (Search & Filters) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by plate or model..."
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
            New Vehicle
          </button>
        </div>
      </div>

      {/* Vehicles Data Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">NO</th>
                <th className="px-4 py-3 font-medium">Plate</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Odometer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((v, index) => (
                <tr key={v._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{v.registrationNumber}</td>
                  <td className="px-4 py-3">{v.model}</td>
                  <td className="px-4 py-3">{v.vehicleType}</td>
                  <td className="px-4 py-3">{v.maxPayload} kg</td>
                  <td className="px-4 py-3 font-mono">{v.currentOdometer}</td>
                  <td className="px-4 py-3">{getStatusBadge(v.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleStatusToggle(v)}
                      className="p-1 mr-2 text-primary hover:bg-primary/10 rounded-md transition-colors text-xs font-semibold"
                      title={v.status === 'out_of_service' ? "Mark as Idle" : "Mark Out of Service"}
                    >
                      {v.status === 'out_of_service' ? "Reactivate" : "Retire"}
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      title="Delete Vehicle"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vehicles.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No vehicles found. Click "New Vehicle" to register one.
            </div>
          )}
        </div>
      </div>

      {/* New Vehicle Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-lg">New Vehicle Registration</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">Registration Number</label>
                <input
                  type="text"
                  {...register('registrationNumber')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. MH 00 AA 1111"
                />
                {errors.registrationNumber && <p className="text-xs text-destructive mt-1">{errors.registrationNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max Payload (kg)</label>
                <input
                  type="number"
                  {...register('maxPayload', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 5000"
                />
                {errors.maxPayload && <p className="text-xs text-destructive mt-1">{errors.maxPayload.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Odometer (km)</label>
                <input
                  type="number"
                  {...register('currentOdometer', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 29000"
                />
                {errors.currentOdometer && <p className="text-xs text-destructive mt-1">{errors.currentOdometer.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  {...register('vehicleType')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. Van, Truck, Trailer"
                />
                {errors.vehicleType && <p className="text-xs text-destructive mt-1">{errors.vehicleType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  {...register('model')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 2017 Mini"
                />
                {errors.model && <p className="text-xs text-destructive mt-1">{errors.model.message}</p>}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
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
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserVehicles;
