import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wrench, Search, Plus, Filter, ArrowUpDown, X, Settings2 } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

// --- Form Validation Schema ---
const maintenanceSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle is required'),
  issue: z.string().min(5, 'Description of issue is required (min 5 chars)'),
  date: z.string().min(1, 'Date is required'),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

const UserMaintenance: React.FC = () => {
  const { maintenanceLogs: logs, addMaintenanceLog, deleteMaintenanceLog, vehicles } = useFleet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema)
  });

  const onSubmit = (data: MaintenanceFormValues) => {
    addMaintenanceLog({
      id: Math.floor(Math.random() * 1000).toString(),
      vehicleId: data.vehicle,
      issue: data.issue,
      date: new Date(data.date).toLocaleDateString('en-GB'),
      cost: 0,
      status: 'New'
    });
    setIsModalOpen(false);
    reset();
  };

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
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Log ID</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Vehicle</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Issue/Service</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Date</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Cost (₹)</th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted transition-colors">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground font-mono">#{log.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{vehicles.find(v => v.id === log.vehicleId)?.model || log.vehicleId}</td>
                  <td className="px-4 py-3">{log.issue}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.date}</td>
                  <td className="px-4 py-3 font-mono">{log.cost}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${log.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        log.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteMaintenanceLog(log.id)}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
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
                <label className="block text-sm font-medium mb-1 text-foreground">Vehicle Name</label>
                <select
                  {...register('vehicle')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none bg-no-repeat"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select vehicle in shop...</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>)}
                </select>
                {errors.vehicle && <p className="text-xs text-destructive mt-1">{errors.vehicle.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Issue / Service</label>
                <input
                  type="text"
                  {...register('issue')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. Engine tune-up, Oil Change"
                />
                {errors.issue && <p className="text-xs text-destructive mt-1">{errors.issue.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
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
