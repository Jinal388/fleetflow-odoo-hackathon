import api from '../lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'manager' | 'dispatcher';
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      email: string;
      name: string;
      role: string;
      isVerified: boolean;
      isActive: boolean;
    };
    token: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  async register(data: RegisterData): Promise<any> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    const response = await api.post('/auth/verify-email', data);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<any> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordData): Promise<any> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }

  async resendVerification(email: string): Promise<any> {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
