import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Download, TrendingUp, DollarSign, Activity, FileText } from 'lucide-react';

const roiData = [
  { name: 'Van-42', roi: 12.5, revenue: 12000, cost: 4500 },
  { name: 'Truck-08', roi: 8.2, revenue: 25000, cost: 12000 },
  { name: 'Van-15', roi: 15.1, revenue: 15000, cost: 3500 },
  { name: 'Bike-02', roi: 22.4, revenue: 8000, cost: 1200 },
  { name: 'Truck-12', roi: 5.6, revenue: 18000, cost: 14000 },
];

const fuelEfficiencyData = [
  { month: 'Jan', avgKmPerL: 4.2 },
  { month: 'Feb', avgKmPerL: 4.1 },
  { month: 'Mar', avgKmPerL: 4.5 },
  { month: 'Apr', avgKmPerL: 4.8 },
  { month: 'May', avgKmPerL: 4.7 },
  { month: 'Jun', avgKmPerL: 5.2 },
];

const AdminAnalytics: React.FC = () => {
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
          <h3 className="text-3xl font-bold mb-1">4.8 <span className="text-base font-normal text-muted-foreground">km/L</span></h3>
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
          <h3 className="text-3xl font-bold mb-1">12.8%</h3>
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
          <h3 className="text-3xl font-bold mb-1">₹8.42</h3>
          <p className="text-sm font-medium text-foreground/80">Cost-per-km</p>
          <p className="text-xs text-muted-foreground mt-1">Includes fuel & maintenance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Fuel Efficiency Chart */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Fuel Efficiency Trend (km/L)</h3>
            <p className="text-sm text-muted-foreground">Monthly average fuel performance across the fleet.</p>
          </div>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={fuelEfficiencyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="avgKmPerL" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorKm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle ROI Bar Chart */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Top Vehicles by ROI (%)</h3>
            <p className="text-sm text-muted-foreground">Return on investment based on generated revenue vs costs.</p>
          </div>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roiData}
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
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAnalytics;
