import api from '../lib/api';

export interface Vehicle {
  _id?: string;
  name: string;
  registrationNumber: string;
  licensePlate: string;
  make: string;
  vehicleModel: string;
  year: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  capacity: number;
  maxLoadCapacity: number;
  odometer: number;
  mileage: number;
  acquisitionCost: number;
  status: 'available' | 'on_trip' | 'in_shop' | 'out_of_service';
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  isActive: boolean;
}

class VehicleService {
  async getAllVehicles(): Promise<Vehicle[]> {
    const response = await api.get('/vehicles');
    return response.data.data;
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await api.get(`/vehicles/${id}`);
    return response.data.data;
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    const response = await api.get('/vehicles/available');
    return response.data.data;
  }

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await api.post('/vehicles', data);
    return response.data.data;
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data.data;
  }

  async deleteVehicle(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  }
}

export default new VehicleService();
