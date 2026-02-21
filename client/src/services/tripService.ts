import api from '../lib/api';

export interface Trip {
  _id?: string;
  vehicle: string;
  driver: string;
  cargoWeight: number;
  origin: string;
  destination: string;
  revenue: number;
  status: 'draft' | 'dispatched' | 'completed' | 'cancelled';
  startOdometer?: number;
  endOdometer?: number;
  distance?: number;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class TripService {
  async getAllTrips(): Promise<Trip[]> {
    const response = await api.get('/trips');
    return response.data.data;
  }

  async getTripById(id: string): Promise<Trip> {
    const response = await api.get(`/trips/${id}`);
    return response.data.data;
  }

  async getActiveTrips(): Promise<Trip[]> {
    const response = await api.get('/trips/active');
    return response.data.data;
  }

  async getTripsByVehicle(vehicleId: string): Promise<Trip[]> {
    const response = await api.get(`/trips/vehicle/${vehicleId}`);
    return response.data.data;
  }

  async getTripsByDriver(driverId: string): Promise<Trip[]> {
    const response = await api.get(`/trips/driver/${driverId}`);
    return response.data.data;
  }

  async createTrip(data: Partial<Trip>): Promise<Trip> {
    const response = await api.post('/trips', data);
    return response.data.data;
  }

  async updateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
    const response = await api.put(`/trips/${id}`, data);
    return response.data.data;
  }

  async dispatchTrip(id: string): Promise<Trip> {
    const response = await api.patch(`/trips/${id}/dispatch`);
    return response.data.data;
  }

  async completeTrip(id: string, endOdometer: number): Promise<Trip> {
    const response = await api.patch(`/trips/${id}/complete`, { endOdometer });
    return response.data.data;
  }

  async cancelTrip(id: string): Promise<Trip> {
    const response = await api.patch(`/trips/${id}/cancel`);
    return response.data.data;
  }
}

export default new TripService();
