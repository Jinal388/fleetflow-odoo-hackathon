import React, { useState, useEffect } from 'react';
import { Receipt, Search, Plus, X, Loader2 } from 'lucide-react';
import fuelService, { type FuelEntry } from '../../services/fuelService';
import vehicleService, { type Vehicle } from '../../services/vehicleService';
import driverService, { type Driver } from '../../services/driverService';
import authService from '../../services/authService';

const AdminExpenses: React.FC = () => {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isDispatcher = currentUser?.role === 'dispatcher';
  const canCreate = isAdmin || isManager || isDispatcher;
  
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    type: 'refuel' as 'refuel' | 'consumption',
    quantity: 0,
    cost: 0,
    pricePerUnit: 0,
    mileage: 0,
    date: new Date().toISOString().split('T')[0],
    location: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fuelData, vehiclesData, driversData] = await Promise.all([
        fuelService.getAllFuelEntries(),
        vehicleService.getAllVehicles(),
        driverService.getAllDrivers(),
      ]);
      setFuelEntries(fuelData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fuelService.createFuelEntry({
        ...formData,
        date: new Date(formData.date),
      });
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create fuel entry');
    }
  };

  const resetForm = () => {
    setFormData({
      vehicle: '',
      driver: '',
      type: 'refuel',
      quantity: 0,
      cost: 0,
      pricePerUnit: 0,
      mileage: 0,
      date: new Date().toISOString().split('T')[0],
      location: '',
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    return vehicle ? `${vehicle.name} (${vehicle.licensePlate})` : vehicleId;
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d._id === driverId);
    return driver ? driver.name : driverId;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Receipt className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Fuel & Expense Logging</h1>
          <p className="text-sm text-muted-foreground">Track fuel consumption and costs per vehicle.</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Fuel Entry
          </button>
        )}
      </div>

      {/* Fuel Entries Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Loading fuel entries...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Quantity (L)</th>
                  <th className="px-4 py-3 font-medium">Cost</th>
                  <th className="px-4 py-3 font-medium">Price/Unit</th>
                  <th className="px-4 py-3 font-medium">Mileage</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fuelEntries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{getVehicleName(entry.vehicle)}</td>
                    <td className="px-4 py-3">{getDriverName(entry.driver)}</td>
                    <td className="px-4 py-3 capitalize">{entry.type}</td>
                    <td className="px-4 py-3 font-mono">{entry.quantity}</td>
                    <td className="px-4 py-3 font-mono">${entry.cost}</td>
                    <td className="px-4 py-3 font-mono">${entry.pricePerUnit}</td>
                    <td className="px-4 py-3">{entry.mileage} km</td>
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
        )}
      </div>

      {/* Add Fuel Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-lg">Add Fuel Entry</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle *</label>
                  <select
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Driver *</label>
                  <select
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  >
                    <option value="refuel">Refuel</option>
                    <option value="consumption">Consumption</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quantity (Liters) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Total Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => {
                      const cost = parseFloat(e.target.value);
                      const pricePerUnit = formData.quantity > 0 ? cost / formData.quantity : 0;
                      setFormData({ ...formData, cost, pricePerUnit });
                    }}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit}
                    readOnly
                    className="w-full px-3 py-2 bg-muted border border-input rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mileage (km) *</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    placeholder="e.g., Shell Station, Main Street"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpenses;
