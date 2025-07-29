import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const authService = {
  login: async (credentials) => {
    console.log('AuthService: Enviando login request:', credentials.username);
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    
    console.log('AuthService: Login response:', {
      status: response.status,
      data: response.data ? {
        username: response.data.username,
        role: response.data.role,
        email: response.data.email,
        hasToken: !!response.data.token
      } : null
    });
    
    return response;
  },

  register: async (userData) => {
    console.log('AuthService: Enviando register request:', {
      username: userData.username,
      role: userData.role,
      hasAdminCode: !!userData.adminCode
    });
    
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    
    console.log('AuthService: Register response:', {
      status: response.status,
      data: response.data ? {
        username: response.data.username,
        role: response.data.role,
        email: response.data.email,
        hasToken: !!response.data.token
      } : null
    });
    
    return response;
  },

  validateToken: async (token) => {
    console.log('AuthService: Validando token...');
    const response = await api.post(ENDPOINTS.AUTH.VALIDATE_TOKEN, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('AuthService: Token validation response:', {
      status: response.status,
      valid: response.data?.valid
    });
    
    return response;
  },

  forgotPassword: async (email) => {
    console.log('AuthService: Forgot password request for:', email);
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },
};