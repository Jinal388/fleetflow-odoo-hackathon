import React from 'react';
import { Truck, Wrench, Package, Route, Activity, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFleet } from '../../context/FleetContext';

const UserDashboard: React.FC = () => {
    const { vehicles, trips, maintenanceLogs } = useFleet();

    // Calculate real KPIs from Context data
    const activeFleetCount = vehicles.filter(v => v.status === 'On Trip').length;
    const maintenanceAlertsCount = maintenanceLogs.filter(m => m.status !== 'Completed').length;
    const activeTripsCount = trips.filter(t => t.status === 'On way' || t.status === 'Pending').length;

    // Utilization: Active vehicles / Total serviceable vehicles
    const serviceableVehicles = vehicles.filter(v => v.status !== 'Out of Service').length;
    const utilizationRate = serviceableVehicles > 0 ? Math.round((activeFleetCount / serviceableVehicles) * 100) : 0;

    const kpis = [
        { name: 'Active Fleet', value: activeFleetCount.toString(), subtitle: 'Vehicles on trip', icon: Truck, trend: '+4%', trendColor: 'text-emerald-500' },
        { name: 'Maintenance Alerts', value: maintenanceAlertsCount.toString(), subtitle: 'Vehicles in shop', icon: Wrench, trend: '-2%', trendColor: 'text-emerald-500' },
        { name: 'Utilization Rate', value: `${utilizationRate}%`, subtitle: 'Assigned vs Idle', icon: Activity, trend: '+12%', trendColor: 'text-emerald-500' },
        { name: 'Pending Cargo', value: activeTripsCount.toString(), subtitle: 'Active or pending trips', icon: Package, trend: '-5%', trendColor: 'text-rose-500' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'On way': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">On Trip</span>;
            case 'Delivered': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">Delivered</span>;
            case 'Pending': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">Pending</span>;
            default: return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
                    <p className="text-sm text-muted-foreground mt-1">High-level overview of your fleet's daily operations.</p>
                </div>
                <div className="flex gap-2">
                    <button className="h-9 px-4 text-sm font-medium rounded-lg border border-input bg-card hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2">
                        Filter <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="bg-card border border-border shadow-sm rounded-xl p-5 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-semibold ${kpi.trendColor}`}>{kpi.trend}</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold mb-1">{kpi.value}</h3>
                            <p className="text-sm font-medium text-foreground/80">{kpi.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">

                {/* Active Trips Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden"
                >
                    <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Route className="w-5 h-5 text-primary" />
                            <h2 className="font-semibold">Active Trips Monitoring</h2>
                        </div>
                        <button className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Trip ID</th>
                                    <th className="px-5 py-3 font-medium">Vehicle</th>
                                    <th className="px-5 py-3 font-medium">Origin</th>
                                    <th className="px-5 py-3 font-medium">Destination</th>
                                    <th className="px-5 py-3 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.slice(0, 5).map((trip) => {
                                    const vName = vehicles.find(v => v.id === trip.vehicleId)?.model || trip.vehicleId;
                                    return (
                                        <tr key={trip.id} className="hover:bg-muted/30 transition-colors border-t border-border/50">
                                            <td className="px-5 py-4 font-medium text-foreground">{trip.id}</td>
                                            <td className="px-5 py-4">{vName}</td>
                                            <td className="px-5 py-4">{trip.origin}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{trip.destination}</td>
                                            <td className="px-5 py-4 text-right">{getStatusBadge(trip.status)}</td>
                                        </tr>
                                    );
                                })}
                                {trips.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No active trips</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Quick Insights / Analytics */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="rounded-xl border border-border bg-card shadow-sm p-5"
                >
                    <h2 className="font-semibold mb-6">Fleet Health Overview</h2>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Operational Utilization</span>
                                <span className="font-medium">{utilizationRate}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${utilizationRate}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">In Maintenance</span>
                                <span className="font-medium">{maintenanceAlertsCount} Vehicles</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: maintenanceAlertsCount > 0 ? '15%' : '0%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Out of Service</span>
                                <span className="font-medium">{vehicles.filter(v => v.status === 'Out of Service').length} Vehicles</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-destructive h-2 rounded-full" style={{ width: vehicles.filter(v => v.status === 'Out of Service').length > 0 ? '5%' : '0%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-sm font-medium mb-4">Recent Alerts</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
                                <Wrench className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-amber-600 dark:text-amber-400">Scheduled Service Due</p>
                                    <p className="text-amber-600/80 dark:text-amber-400/80 text-xs mt-1">Truck-08 mileage exceeded 50,000km</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default UserDashboard;
