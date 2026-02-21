import api from '../lib/api';

export interface FuelEntry {
  _id?: string;
  vehicle: string;
  driver: string;
  type: 'refuel' | 'consumption';
  quantity: number;
  cost: number;
  pricePerUnit: number;
  mileage: number;
  date: Date;
  location?: string;
  receiptNumber?: string;
  notes?: string;
  createdBy: string;
}

class FuelService {
  async getAllFuelEntries(): Promise<FuelEntry[]> {
    const response = await api.get('/fuel');
    return response.data.data;
  }

  async getFuelEntryById(id: string): Promise<FuelEntry> {
    const response = await api.get(`/fuel/${id}`);
    return response.data.data;
  }

  async getFuelStatsByVehicle(vehicleId: string): Promise<any> {
    const response = await api.get(`/fuel/stats/vehicle/${vehicleId}`);
    return response.data.data;
  }

  async createFuelEntry(data: Partial<FuelEntry>): Promise<FuelEntry> {
    const response = await api.post('/fuel', data);
    return response.data.data;
  }
}

export default new FuelService();
