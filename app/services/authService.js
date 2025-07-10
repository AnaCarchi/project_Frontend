import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const authService = {
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  register: async (userData) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  },

  validateToken: async (token) => {
    const response = await api.post(ENDPOINTS.AUTH.VALIDATE_TOKEN, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },
};
