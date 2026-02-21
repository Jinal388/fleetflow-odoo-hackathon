import api from '../lib/api';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'dispatcher';
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateManagerData {
  email: string;
  password: string;
  name: string;
  role: 'manager';
}

class UserService {
  async createManager(data: CreateManagerData): Promise<User> {
    const response = await api.post('/auth/register', data);
    return response.data.data.user;
  }

  async getAllUsers(): Promise<User[]> {
    // This endpoint would need to be added to backend
    const response = await api.get('/users');
    return response.data.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  }

  async deactivateUser(id: string): Promise<User> {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data.data;
  }
}

export default new UserService();
