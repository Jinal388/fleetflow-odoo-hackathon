import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wrench, Search, Plus, Filter, ArrowUpDown, X, Settings2, Loader2 } from 'lucide-react';
import maintenanceService, { type Maintenance } from '../../services/maintenanceService';
import vehicleService, { type Vehicle } from '../../services/vehicleService';

// --- Form Validation Schema ---
const maintenanceSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle is required'),
  type: z.enum(['routine', 'repair', 'inspection', 'emergency']),
  description: z.string().min(5, 'Description is required (min 5 chars)'),
  scheduledDate: z.string().min(1, 'Date is required'),
  mileageAtService: z.number().min(0, 'Mileage is required'),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

const UserMaintenance: React.FC = () => {
  const [maintenanceLogs, setMaintenanceLogs] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema)
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintenanceData, vehiclesData] = await Promise.all([
        maintenanceService.getAllMaintenance(),
        vehicleService.getAllVehicles(),
      ]);
      setMaintenanceLogs(maintenanceData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      await maintenanceService.createMaintenance({
        vehicle: data.vehicle,
        type: data.type,
        description: data.description,
        scheduledDate: new Date(data.scheduledDate),
        mileageAtService: data.mileageAtService,
        status: 'scheduled',
        createdBy: localStorage.getItem('userId') || '',
      });
      await fetchData();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create maintenance:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this maintenance?')) return;
    try {
      await maintenanceService.cancelMaintenance(id);
      await fetchData();
    } catch (error) {
      console.error('Failed to cancel maintenance:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">Completed</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">In Progress</span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">Scheduled</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-rose-50 text-rose-700 border-rose-200">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200">{status}</span>;
    }
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    return vehicle ? `${vehicle.registrationNumber} - ${vehicle.model}` : vehicleId;
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
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
          <Wrench className="text-destructive w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Maintenance & Service Logs</h1>
          <p className="text-sm text-muted-foreground">Keep your vehicles healthy. Track check-ups and repairs.</p>
        </div>
      </div>

      {/* Action Bar (Search & Filters) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Log ID or Vehicle..."
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
            Create New Service
          </button>
        </div>
      </div>

      {/* Maintenance Data Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Vehicle</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Type</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Description</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Scheduled Date</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Cost ($)</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {maintenanceLogs.map((log) => (
                <tr key={log._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{getVehicleName(log.vehicle)}</td>
                  <td className="px-4 py-3 capitalize">{log.type}</td>
                  <td className="px-4 py-3">{log.description}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(log.scheduledDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-mono">{log.cost || 0}</td>
                  <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                  <td className="px-4 py-3 text-right">
                    {log.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancel(log._id!)}
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
          {maintenanceLogs.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No service logs found.
            </div>
          )}
        </div>
      </div>

      {/* New Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-destructive" />
                New Service Log
              </h3>
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
                <label className="block text-sm font-medium mb-1 text-foreground">Vehicle</label>
                <select
                  {...register('vehicle')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                >
                  <option value="">Select vehicle...</option>
                  {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} - {v.model}</option>)}
                </select>
                {errors.vehicle && <p className="text-xs text-destructive mt-1">{errors.vehicle.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Type</label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                >
                  <option value="">Select type...</option>
                  <option value="routine">Routine</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="emergency">Emergency</option>
                </select>
                {errors.type && <p className="text-xs text-destructive mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
                <input
                  type="text"
                  {...register('description')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. Engine tune-up, Oil Change"
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Scheduled Date</label>
                <input
                  type="date"
                  {...register('scheduledDate')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                {errors.scheduledDate && <p className="text-xs text-destructive mt-1">{errors.scheduledDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Mileage at Service</label>
                <input
                  type="number"
                  {...register('mileageAtService', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 50000"
                />
                {errors.mileageAtService && <p className="text-xs text-destructive mt-1">{errors.mileageAtService.message}</p>}
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="w-1/2 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 border border-primary rounded-md transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="w-1/2 py-2 text-sm font-medium border border-destructive text-destructive bg-background hover:bg-destructive/10 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserMaintenance;
