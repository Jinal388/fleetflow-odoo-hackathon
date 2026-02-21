import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car, Search, Plus, Filter, ArrowUpDown, X, Settings2 } from 'lucide-react';

// --- Mock Data ---
interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  capacity: string;
  odometer: string;
  status: 'Idle' | 'On Trip' | 'In Shop' | 'Out of Service';
}

const initialVehicles: Vehicle[] = [
  { id: '1', plate: 'MH 00', model: '2017 Mini', type: 'Van', capacity: '5 tonn', odometer: '29000', status: 'Idle' },
  { id: '2', plate: 'KA 12', model: 'Ford Transit', type: 'Van', capacity: '3 tonn', odometer: '45000', status: 'On Trip' },
  { id: '3', plate: 'DL 9C', model: 'Volvo FH', type: 'Truck', capacity: '20 tonn', odometer: '120500', status: 'In Shop' },
];

// --- Form Validation Schema ---
const vehicleSchema = z.object({
  plate: z.string().min(1, 'License Plate is required'),
  capacity: z.string().min(1, 'Max Payload is required'),
  odometer: z.string().min(1, 'Initial Odometer is required'),
  type: z.string().min(1, 'Type is required'),
  model: z.string().min(1, 'Model is required'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const AdminVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema)
  });

  const onSubmit = (data: VehicleFormValues) => {
    // Add new mocked vehicle
    const newVehicle: Vehicle = {
      id: Math.random().toString(),
      plate: data.plate,
      model: data.model,
      type: data.type,
      capacity: data.capacity,
      odometer: data.odometer.toString(),
      status: 'Idle'
    };
    setVehicles([...vehicles, newVehicle]);
    setIsModalOpen(false);
    reset();
  };

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
                <tr key={v.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{v.plate}</td>
                  <td className="px-4 py-3">{v.model}</td>
                  <td className="px-4 py-3">{v.type}</td>
                  <td className="px-4 py-3">{v.capacity}</td>
                  <td className="px-4 py-3 font-mono">{v.odometer}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${v.status === 'Idle' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        v.status === 'On Trip' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          v.status === 'In Shop' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-gray-100 text-gray-700 border-gray-300'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        const newVehicles = vehicles.map(item => item.id === v.id ? { ...item, status: v.status === 'Out of Service' ? 'Idle' as const : 'Out of Service' as const } : item);
                        setVehicles(newVehicles);
                      }}
                      className="p-1 mr-2 text-primary hover:bg-primary/10 rounded-md transition-colors text-xs font-semibold"
                      title={v.status === 'Out of Service' ? "Mark as Idle" : "Mark Out of Service"}
                    >
                      {v.status === 'Out of Service' ? "Reactivate" : "Retire"}
                    </button>
                    <button
                      onClick={() => setVehicles(vehicles.filter(item => item.id !== v.id))}
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
                <label className="block text-sm font-medium mb-1">License Plate</label>
                <input
                  type="text"
                  {...register('plate')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. MH 00 AA 1111"
                />
                {errors.plate && <p className="text-xs text-destructive mt-1">{errors.plate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max Payload</label>
                <input
                  type="text"
                  {...register('capacity')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 5 tonnes"
                />
                {errors.capacity && <p className="text-xs text-destructive mt-1">{errors.capacity.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Initial Odometer</label>
                <input
                  type="number"
                  {...register('odometer')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 29000"
                />
                {errors.odometer && <p className="text-xs text-destructive mt-1">{errors.odometer.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  {...register('type')}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. Van, Truck, Trailer"
                />
                {errors.type && <p className="text-xs text-destructive mt-1">{errors.type.message}</p>}
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

export default AdminVehicles;
