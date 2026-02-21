import api from '../lib/api';

export interface Driver {
  _id?: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  licenseExpiryDate: Date;
  phone: string;
  email?: string;
  status: 'on_duty' | 'off_duty' | 'on_trip' | 'suspended' | 'on_leave';
  safetyScore: number;
  totalTrips: number;
  completedTrips: number;
  assignedVehicle?: string;
  isActive: boolean;
}

class DriverService {
  async getAllDrivers(): Promise<Driver[]> {
    const response = await api.get('/drivers');
    return response.data.data;
  }

  async getDriverById(id: string): Promise<Driver> {
    const response = await api.get(`/drivers/${id}`);
    return response.data.data;
  }

  async getAvailableDrivers(): Promise<Driver[]> {
    const response = await api.get('/drivers/available');
    return response.data.data;
  }

  async createDriver(data: Partial<Driver>): Promise<Driver> {
    const response = await api.post('/drivers', data);
    return response.data.data;
  }

  async updateDriver(id: string, data: Partial<Driver>): Promise<Driver> {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data.data;
  }

  async deleteDriver(id: string): Promise<void> {
    await api.delete(`/drivers/${id}`);
  }
}

export default new DriverService();
