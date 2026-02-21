import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Users, Search, Plus, Filter, X } from 'lucide-react';

// --- Mock Data ---
interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  safetyScore: number;
  status: 'On Duty' | 'Off Duty' | 'Suspended';
}

const initialDrivers: Driver[] = [
  { id: '1', name: 'Alex Johnson', licenseNumber: 'DL-19283-X', licenseExpiry: '2026-12-01', safetyScore: 98, status: 'On Duty' },
  { id: '2', name: 'Sarah Connor', licenseNumber: 'DL-88219-Y', licenseExpiry: '2026-02-23', safetyScore: 85, status: 'Off Duty' },
  { id: '3', name: 'Michael Chen', licenseNumber: 'DL-33921-Z', licenseExpiry: '2024-05-12', safetyScore: 60, status: 'Suspended' },
];

// --- Form Validation Schema ---
const driverSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  licenseExpiry: z.string().min(1, 'Expiry date is required'),
});

type DriverFormValues = z.infer<typeof driverSchema>;

const UserDrivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema)
  });

  const onSubmit = (data: DriverFormValues) => {
    const isExpired = new Date(data.licenseExpiry) < new Date();
    const newDriver: Driver = {
      id: Math.random().toString(),
      name: data.name,
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      safetyScore: 100, // Default for new drivers
      status: isExpired ? 'Suspended' : 'Off Duty'
    };
    setDrivers([...drivers, newDriver]);
    setIsModalOpen(false);
    reset();
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    setDrivers(drivers.map(driver => {
      if (driver.id === id) {
        if (new Date(driver.licenseExpiry) < new Date()) {
          return { ...driver, status: 'Suspended' as const };
        }
        const nextStatus = currentStatus === 'On Duty' ? 'Off Duty' : currentStatus === 'Off Duty' ? 'Suspended' : 'On Duty';
        return { ...driver, status: nextStatus as 'On Duty' | 'Off Duty' | 'Suspended' };
      }
      return driver;
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Driver Profiles</h1>
          <p className="text-sm text-muted-foreground">Human resource and safety compliance tracking.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or license..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 hover:bg-accent transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">License / Expiry</th>
                <th className="px-4 py-3 font-medium">Safety Score</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {drivers.map((driver) => {
                const isLicenseExpired = new Date(driver.licenseExpiry) < new Date();
                return (
                  <tr key={driver.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{driver.name}</td>
                    <td className="px-4 py-3">
                      <div className="font-mono">{driver.licenseNumber}</div>
                      <div className={`text-xs mt-0.5 ${isLicenseExpired ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                        Exp: {driver.licenseExpiry} {isLicenseExpired && '(Expired)'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{driver.safetyScore}/100</div>
                        <div className="w-16 h-1.5 rounded-full bg-secondary">
                          <div className={`h-full rounded-full ${driver.safetyScore >= 90 ? 'bg-emerald-500' : driver.safetyScore >= 70 ? 'bg-amber-500' : 'bg-destructive'}`} style={{ width: `${driver.safetyScore}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                        ${driver.status === 'On Duty' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          driver.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleStatus(driver.id, driver.status)}
                        className="px-2 py-1 mr-2 text-xs font-semibold border rounded hover:bg-accent transition-colors"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => setDrivers(drivers.filter(item => item.id !== driver.id))}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors inline-block align-middle"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {drivers.length === 0 && <div className="p-8 text-center text-muted-foreground">No drivers found.</div>}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Add Driver Profile</h3>
              <button onClick={() => { setIsModalOpen(false); reset(); }}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input {...register('name')} className="w-full px-3 py-2 border rounded-md" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Number</label>
                <input {...register('licenseNumber')} className="w-full px-3 py-2 border rounded-md font-mono" />
                {errors.licenseNumber && <p className="text-xs text-destructive mt-1">{errors.licenseNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input type="date" {...register('licenseExpiry')} className="w-full px-3 py-2 border rounded-md" />
                {errors.licenseExpiry && <p className="text-xs text-destructive mt-1">{errors.licenseExpiry.message}</p>}
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium">Add</button>
                <button type="button" onClick={() => { setIsModalOpen(false); reset(); }} className="flex-1 border text-foreground py-2 rounded-md font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDrivers;
