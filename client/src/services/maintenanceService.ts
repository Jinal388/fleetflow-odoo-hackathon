import api from '../lib/api';

export interface Maintenance {
  _id?: string;
  vehicle: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  serviceProvider?: string;
  mileageAtService: number;
  notes?: string;
  createdBy: string;
}

class MaintenanceService {
  async getAllMaintenance(): Promise<Maintenance[]> {
    const response = await api.get('/maintenance');
    return response.data.data;
  }

  async getMaintenanceById(id: string): Promise<Maintenance> {
    const response = await api.get(`/maintenance/${id}`);
    return response.data.data;
  }

  async createMaintenance(data: Partial<Maintenance>): Promise<Maintenance> {
    const response = await api.post('/maintenance', data);
    return response.data.data;
  }

  async completeMaintenance(id: string, cost: number): Promise<Maintenance> {
    const response = await api.patch(`/maintenance/${id}/complete`, { cost });
    return response.data.data;
  }

  async cancelMaintenance(id: string): Promise<Maintenance> {
    const response = await api.patch(`/maintenance/${id}/cancel`);
    return response.data.data;
  }
}

export default new MaintenanceService();
