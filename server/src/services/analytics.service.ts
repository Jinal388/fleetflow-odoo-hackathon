import { Trip } from '../models/trip.model';
import { Fuel } from '../models/fuel.model';
import { Maintenance } from '../models/maintenance.model';
import { Vehicle } from '../models/vehicle.model';
import { TRIP_STATUS, MAINTENANCE_STATUS } from '../config/constants';

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

interface FuelEfficiencyResult {
  vehicleId: string;
  vehicleName: string;
  totalDistance: number;
  totalFuel: number;
  fuelEfficiency: number; // km per liter
}

interface VehicleROI {
  vehicleId: string;
  vehicleName: string;
  totalRevenue: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  operationalCost: number;
  acquisitionCost: number;
  roi: number; // percentage
  netProfit: number;
}

interface FleetUtilization {
  totalVehicles: number;
  activeVehicles: number;
  utilizationRate: number; // percentage
  vehiclesByStatus: Record<string, number>;
}

interface OperationalCostSummary {
  period: string;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOperationalCost: number;
  tripCount: number;
  totalRevenue: number;
  netProfit: number;
}

export class AnalyticsService {
  static async getFuelEfficiency(dateRange?: DateRange): Promise<FuelEfficiencyResult[]> {
    const matchStage: any = { status: TRIP_STATUS.COMPLETED };
    
    if (dateRange?.startDate || dateRange?.endDate) {
      matchStage.createdAt = {};
      if (dateRange.startDate) matchStage.createdAt.$gte = dateRange.startDate;
      if (dateRange.endDate) matchStage.createdAt.$lte = dateRange.endDate;
    }

    const tripData = await Trip.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$vehicle',
          totalDistance: { $sum: '$distance' },
        },
      },
    ]);

    const fuelData = await Fuel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$vehicle',
          totalFuel: { $sum: '$quantity' },
        },
      },
    ]);

    const results: FuelEfficiencyResult[] = [];

    for (const trip of tripData) {
      const fuel = fuelData.find((f) => f._id.toString() === trip._id.toString());
      const vehicle = await Vehicle.findById(trip._id);

      if (fuel && vehicle && fuel.totalFuel > 0) {
        results.push({
          vehicleId: trip._id.toString(),
          vehicleName: vehicle.name,
          totalDistance: trip.totalDistance || 0,
          totalFuel: fuel.totalFuel,
          fuelEfficiency: trip.totalDistance / fuel.totalFuel,
        });
      }
    }

    return results.sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);
  }

  static async getVehicleROI(vehicleId?: string, dateRange?: DateRange): Promise<VehicleROI[]> {
    const vehicleFilter = vehicleId ? { _id: vehicleId } : { isActive: true };
    const vehicles = await Vehicle.find(vehicleFilter);

    const results: VehicleROI[] = [];

    for (const vehicle of vehicles) {
      const matchStage: any = { vehicle: vehicle._id, status: TRIP_STATUS.COMPLETED };
      
      if (dateRange?.startDate || dateRange?.endDate) {
        matchStage.createdAt = {};
        if (dateRange.startDate) matchStage.createdAt.$gte = dateRange.startDate;
        if (dateRange.endDate) matchStage.createdAt.$lte = dateRange.endDate;
      }

      // Calculate revenue
      const revenueData = await Trip.aggregate([
        { $match: matchStage },
        { $group: { _id: null, totalRevenue: { $sum: '$revenue' } } },
      ]);

      // Calculate fuel cost
      const fuelCostData = await Fuel.aggregate([
        { $match: { vehicle: vehicle._id } },
        { $group: { _id: null, totalFuelCost: { $sum: '$cost' } } },
      ]);

      // Calculate maintenance cost
      const maintenanceCostData = await Maintenance.aggregate([
        { $match: { vehicle: vehicle._id, status: MAINTENANCE_STATUS.COMPLETED } },
        { $group: { _id: null, totalMaintenanceCost: { $sum: '$cost' } } },
      ]);

      const totalRevenue = revenueData[0]?.totalRevenue || 0;
      const totalFuelCost = fuelCostData[0]?.totalFuelCost || 0;
      const totalMaintenanceCost = maintenanceCostData[0]?.totalMaintenanceCost || 0;
      const operationalCost = totalFuelCost + totalMaintenanceCost;
      const netProfit = totalRevenue - operationalCost;
      const roi = vehicle.acquisitionCost > 0 ? (netProfit / vehicle.acquisitionCost) * 100 : 0;

      results.push({
        vehicleId: vehicle._id.toString(),
        vehicleName: vehicle.name,
        totalRevenue,
        totalFuelCost,
        totalMaintenanceCost,
        operationalCost,
        acquisitionCost: vehicle.acquisitionCost,
        roi,
        netProfit,
      });
    }

    return results.sort((a, b) => b.roi - a.roi);
  }

  static async getFleetUtilization(): Promise<FleetUtilization> {
    const totalVehicles = await Vehicle.countDocuments({ isActive: true });
    const activeVehicles = await Vehicle.countDocuments({ isActive: true, status: { $ne: 'out_of_service' } });

    const vehiclesByStatus = await Vehicle.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusMap: Record<string, number> = {};
    vehiclesByStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    return {
      totalVehicles,
      activeVehicles,
      utilizationRate: totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0,
      vehiclesByStatus: statusMap,
    };
  }

  static async getOperationalCostSummary(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month' = 'month'
  ): Promise<OperationalCostSummary[]> {
    const dateFormat = groupBy === 'day' ? '%Y-%m-%d' : groupBy === 'week' ? '%Y-W%U' : '%Y-%m';

    const fuelCosts = await Fuel.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$date' } },
          totalFuelCost: { $sum: '$cost' },
        },
      },
    ]);

    const maintenanceCosts = await Maintenance.aggregate([
      {
        $match: {
          completedDate: { $gte: startDate, $lte: endDate },
          status: MAINTENANCE_STATUS.COMPLETED,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$completedDate' } },
          totalMaintenanceCost: { $sum: '$cost' },
        },
      },
    ]);

    const tripData = await Trip.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: TRIP_STATUS.COMPLETED,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          tripCount: { $sum: 1 },
          totalRevenue: { $sum: '$revenue' },
        },
      },
    ]);

    const periodMap = new Map<string, OperationalCostSummary>();

    fuelCosts.forEach((item) => {
      periodMap.set(item._id, {
        period: item._id,
        totalFuelCost: item.totalFuelCost,
        totalMaintenanceCost: 0,
        totalOperationalCost: item.totalFuelCost,
        tripCount: 0,
        totalRevenue: 0,
        netProfit: -item.totalFuelCost,
      });
    });

    maintenanceCosts.forEach((item) => {
      const existing = periodMap.get(item._id) || {
        period: item._id,
        totalFuelCost: 0,
        totalMaintenanceCost: 0,
        totalOperationalCost: 0,
        tripCount: 0,
        totalRevenue: 0,
        netProfit: 0,
      };
      existing.totalMaintenanceCost = item.totalMaintenanceCost;
      existing.totalOperationalCost += item.totalMaintenanceCost;
      existing.netProfit -= item.totalMaintenanceCost;
      periodMap.set(item._id, existing);
    });

    tripData.forEach((item) => {
      const existing = periodMap.get(item._id) || {
        period: item._id,
        totalFuelCost: 0,
        totalMaintenanceCost: 0,
        totalOperationalCost: 0,
        tripCount: 0,
        totalRevenue: 0,
        netProfit: 0,
      };
      existing.tripCount = item.tripCount;
      existing.totalRevenue = item.totalRevenue;
      existing.netProfit += item.totalRevenue;
      periodMap.set(item._id, existing);
    });

    return Array.from(periodMap.values()).sort((a, b) => a.period.localeCompare(b.period));
  }

  static async getCostPerKm(vehicleId?: string): Promise<any[]> {
    const vehicleFilter = vehicleId ? { vehicle: vehicleId } : {};

    const result = await Trip.aggregate([
      { $match: { ...vehicleFilter, status: TRIP_STATUS.COMPLETED, distance: { $gt: 0 } } },
      {
        $lookup: {
          from: 'fuels',
          localField: 'vehicle',
          foreignField: 'vehicle',
          as: 'fuelData',
        },
      },
      {
        $lookup: {
          from: 'maintenances',
          localField: 'vehicle',
          foreignField: 'vehicle',
          as: 'maintenanceData',
        },
      },
      {
        $group: {
          _id: '$vehicle',
          totalDistance: { $sum: '$distance' },
          totalRevenue: { $sum: '$revenue' },
          fuelCost: { $sum: { $sum: '$fuelData.cost' } },
          maintenanceCost: { $sum: { $sum: '$maintenanceData.cost' } },
        },
      },
      {
        $project: {
          vehicleId: '$_id',
          totalDistance: 1,
          totalRevenue: 1,
          totalCost: { $add: ['$fuelCost', '$maintenanceCost'] },
          costPerKm: {
            $cond: [
              { $gt: ['$totalDistance', 0] },
              { $divide: [{ $add: ['$fuelCost', '$maintenanceCost'] }, '$totalDistance'] },
              0,
            ],
          },
          revenuePerKm: {
            $cond: [{ $gt: ['$totalDistance', 0] }, { $divide: ['$totalRevenue', '$totalDistance'] }, 0],
          },
        },
      },
    ]);

    return result;
  }
}
