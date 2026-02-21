import React, { useState, useEffect } from 'react';
import { Route as RouteIcon, Search, Plus, X, Loader2, Truck, CheckCircle } from 'lucide-react';
import tripService, { type Trip } from '../../services/tripService';
import vehicleService, { type Vehicle } from '../../services/vehicleService';
import driverService, { type Driver } from '../../services/driverService';
import authService from '../../services/authService';

const AdminTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [endOdometer, setEndOdometer] = useState(0);
  
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const canCancel = isAdmin || isManager;
  
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    cargoWeight: 0,
    origin: '',
    destination: '',
    revenue: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripService.getAllTrips(),
        vehicleService.getAvailableVehicles(),
        driverService.getAvailableDrivers(),
      ]);
      setTrips(tripsData);
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
      await tripService.createTrip(formData);
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create trip');
    }
  };

  const handleDispatch = async (id: string) => {
    if (!confirm('Are you sure you want to dispatch this trip?')) return;
    
    try {
      await tripService.dispatchTrip(id);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dispatch trip');
    }
  };

  const handleCompleteClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setEndOdometer(trip.startOdometer || 0);
    setIsCompleteModalOpen(true);
  };

  const handleComplete = async () => {
    if (!selectedTrip) return;
    
    try {
      await tripService.completeTrip(selectedTrip._id!, endOdometer);
      setIsCompleteModalOpen(false);
      setSelectedTrip(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete trip');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this trip?')) return;
    
    try {
      await tripService.cancelTrip(id);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel trip');
    }
  };

  const resetForm = () => {
    setFormData({
      vehicle: '',
      driver: '',
      cargoWeight: 0,
      origin: '',
      destination: '',
      revenue: 0,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'dispatched':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
          <RouteIcon className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Trip Management</h1>
          <p className="text-sm text-muted-foreground">Manage fleet trips and dispatches</p>
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
            placeholder="Search trips..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </button>
      </div>

      {/* Trips Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Loading trips...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">NO</th>
                  <th className="px-4 py-3 font-medium">Origin</th>
                  <th className="px-4 py-3 font-medium">Destination</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Cargo (kg)</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trips.map((t, index) => (
                  <tr key={t._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{t.origin}</td>
                    <td className="px-4 py-3">{t.destination}</td>
                    <td className="px-4 py-3 text-xs">{getVehicleName(t.vehicle)}</td>
                    <td className="px-4 py-3">{getDriverName(t.driver)}</td>
                    <td className="px-4 py-3">{t.cargoWeight}</td>
                    <td className="px-4 py-3">${t.revenue}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === 'draft' && (
                          <button
                            onClick={() => handleDispatch(t._id!)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Dispatch Trip"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {t.status === 'dispatched' && (
                          <button
                            onClick={() => handleCompleteClick(t)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Complete Trip"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(t.status === 'draft' || t.status === 'dispatched') && canCancel && (
                          <button
                            onClick={() => handleCancel(t._id!)}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="Cancel Trip"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {trips.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No trips found. Click "New Trip" to create one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-lg">Create New Trip</h3>
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
                        {d.name} ({d.licenseNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Origin *</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Destination *</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cargo Weight (kg) *</label>
                  <input
                    type="number"
                    value={formData.cargoWeight}
                    onChange={(e) => setFormData({ ...formData, cargoWeight: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Revenue ($) *</label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    required
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
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {isCompleteModalOpen && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-lg">Complete Trip</h3>
              <button
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setSelectedTrip(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Start Odometer: <span className="font-semibold text-foreground">{selectedTrip.startOdometer} km</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Odometer (km) *</label>
                <input
                  type="number"
                  value={endOdometer}
                  onChange={(e) => setEndOdometer(parseFloat(e.target.value))}
                  min={selectedTrip.startOdometer || 0}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be greater than or equal to start odometer
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCompleteModalOpen(false);
                    setSelectedTrip(null);
                  }}
                  className="px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                >
                  Complete Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;
