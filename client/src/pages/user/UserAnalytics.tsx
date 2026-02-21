import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Download, TrendingUp, DollarSign, Activity, FileText, Loader2 } from 'lucide-react';
import analyticsService, { type FuelEfficiency, type VehicleROI, type FleetUtilization } from '../../services/analyticsService';

const UserAnalytics: React.FC = () => {
  const [fuelEfficiencyData, setFuelEfficiencyData] = useState<FuelEfficiency[]>([]);
  const [roiData, setRoiData] = useState<VehicleROI[]>([]);
  const [fleetUtilization, setFleetUtilization] = useState<FleetUtilization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [fuelData, roiDataResult, utilizationData] = await Promise.all([
        analyticsService.getFuelEfficiency(),
        analyticsService.getVehicleROI(),
        analyticsService.getFleetUtilization(),
      ]);
      setFuelEfficiencyData(fuelData);
      setRoiData(roiDataResult);
      setFleetUtilization(utilizationData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average fuel efficiency
  const avgFuelEfficiency = fuelEfficiencyData.length > 0
    ? (fuelEfficiencyData.reduce((acc, curr) => acc + curr.fuelEfficiency, 0) / fuelEfficiencyData.length).toFixed(1)
    : '0.0';

  // Calculate average ROI
  const avgROI = roiData.length > 0
    ? (roiData.reduce((acc, curr) => acc + curr.roi, 0) / roiData.length).toFixed(1)
    : '0.0';

  // Calculate average cost per km (simplified)
  const avgCostPerKm = roiData.length > 0
    ? (roiData.reduce((acc, curr) => acc + curr.operationalCost, 0) / roiData.length / 1000).toFixed(2)
    : '0.00';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operational Analytics & Financials</h1>
          <p className="text-sm text-muted-foreground mt-1">Data-driven decisions based on vehicle ROI and fuel efficiency.</p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input bg-card hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 shadow-sm">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="h-9 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-500">+2.4%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{avgFuelEfficiency} <span className="text-base font-normal text-muted-foreground">km/L</span></h3>
          <p className="text-sm font-medium text-foreground/80">Fleet Fuel Efficiency</p>
          <p className="text-xs text-muted-foreground mt-1">Average across all active vehicles</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-500">+11.2%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{avgROI}%</h3>
          <p className="text-sm font-medium text-foreground/80">Average Vehicle ROI</p>
          <p className="text-xs text-muted-foreground mt-1">(Revenue - Operating Cost) / Acq. Cost</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-rose-500">-1.5%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">${avgCostPerKm}</h3>
          <p className="text-sm font-medium text-foreground/80">Cost-per-km</p>
          <p className="text-xs text-muted-foreground mt-1">Includes fuel & maintenance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Fuel Efficiency Chart */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Fuel Efficiency by Vehicle (km/L)</h3>
            <p className="text-sm text-muted-foreground">Fuel performance across the fleet.</p>
          </div>
          <div className="h-[300px] w-full">
            {fuelEfficiencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={fuelEfficiencyData.map(item => ({
                    name: item.vehicleName.substring(0, 10),
                    efficiency: item.fuelEfficiency,
                  }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorKm)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No fuel efficiency data available
              </div>
            )}
          </div>
        </div>

        {/* Vehicle ROI Bar Chart */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Top Vehicles by ROI (%)</h3>
            <p className="text-sm text-muted-foreground">Return on investment based on generated revenue vs costs.</p>
          </div>
          <div className="h-[300px] w-full">
            {roiData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roiData.slice(0, 5).map(item => ({
                    name: item.vehicleName.substring(0, 10),
                    roi: item.roi,
                    revenue: item.totalRevenue,
                  }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="roi" name="ROI (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No ROI data available
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Fleet Utilization Summary */}
      {fleetUtilization && (
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Fleet Utilization Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
              <p className="text-2xl font-bold">{fleetUtilization.totalVehicles}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Vehicles</p>
              <p className="text-2xl font-bold text-emerald-500">{fleetUtilization.activeVehicles}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Utilization Rate</p>
              <p className="text-2xl font-bold text-primary">{fleetUtilization.utilizationRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Idle Vehicles</p>
              <p className="text-2xl font-bold text-amber-500">{fleetUtilization.vehiclesByStatus.idle || 0}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserAnalytics;
