import api from '../lib/api';

export interface FuelEfficiency {
  vehicleId: string;
  vehicleName: string;
  totalDistance: number;
  totalFuel: number;
  fuelEfficiency: number;
}

export interface VehicleROI {
  vehicleId: string;
  vehicleName: string;
  totalRevenue: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  operationalCost: number;
  acquisitionCost: number;
  roi: number;
  netProfit: number;
}

export interface FleetUtilization {
  totalVehicles: number;
  activeVehicles: number;
  utilizationRate: number;
  vehiclesByStatus: Record<string, number>;
}

export interface OperationalCostSummary {
  period: string;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOperationalCost: number;
  tripCount: number;
  totalRevenue: number;
  netProfit: number;
}

class AnalyticsService {
  async getFuelEfficiency(startDate?: string, endDate?: string): Promise<FuelEfficiency[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/fuel-efficiency?${params.toString()}`);
    return response.data.data;
  }

  async getVehicleROI(vehicleId?: string, startDate?: string, endDate?: string): Promise<VehicleROI[]> {
    const params = new URLSearchParams();
    if (vehicleId) params.append('vehicleId', vehicleId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/vehicle-roi?${params.toString()}`);
    return response.data.data;
  }

  async getFleetUtilization(): Promise<FleetUtilization> {
    const response = await api.get('/analytics/fleet-utilization');
    return response.data.data;
  }

  async getOperationalCostSummary(
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'month'
  ): Promise<OperationalCostSummary[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      groupBy,
    });
    
    const response = await api.get(`/analytics/operational-cost-summary?${params.toString()}`);
    return response.data.data;
  }

  async getCostPerKm(vehicleId?: string): Promise<any[]> {
    const params = vehicleId ? `?vehicleId=${vehicleId}` : '';
    const response = await api.get(`/analytics/cost-per-km${params}`);
    return response.data.data;
  }
}

export default new AnalyticsService();
