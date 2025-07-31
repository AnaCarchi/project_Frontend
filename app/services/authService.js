import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const authService = {
  login: async (credentials) => {
    try {
      console.log(' AuthService: Enviando login request:', credentials.username);
      
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      
      console.log(' AuthService: Login response received:', {
        status: response.status,
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        username: response.data?.username,
        role: response.data?.role,
        email: response.data?.email
      });

      //  VALIDAR QUE LA RESPUESTA TENGA TODOS LOS DATOS NECESARIOS
      if (!response.data || !response.data.token) {
        throw new Error('Respuesta de login inválida: falta token');
      }

      if (!response.data.username || !response.data.role) {
        throw new Error('Respuesta de login inválida: faltan datos de usuario');
      }

      console.log('🎉 Login exitoso con token válido');
      return response;
      
    } catch (error) {
      console.error(' Error en authService.login:', error);
      
      // Mejorar el manejo de errores
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas');
      } else if (error.response?.status === 403) {
        throw new Error('Acceso denegado');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log(' AuthService: Enviando register request:', {
        username: userData.username,
        role: userData.role,
        hasAdminCode: !!userData.adminCode
      });
      
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
      
      console.log(' AuthService: Register response received:', {
        status: response.status,
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        username: response.data?.username,
        role: response.data?.role,
        email: response.data?.email
      });

      //  VALIDAR RESPUESTA DE REGISTRO
      if (!response.data || !response.data.token) {
        throw new Error('Respuesta de registro inválida: falta token');
      }

      return response;
      
    } catch (error) {
      console.error(' Error en authService.register:', error);
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Datos de registro inválidos');
      } else if (error.response?.status === 403) {
        throw new Error('Código de administrador inválido');
      }
      
      throw error;
    }
  },

  validateToken: async (token) => {
    try {
      console.log(' AuthService: Validando token...');
      
      const response = await api.post(ENDPOINTS.AUTH.VALIDATE_TOKEN, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('AuthService: Token validation response:', {
        status: response.status,
        valid: response.data?.valid,
        username: response.data?.username,
        role: response.data?.role
      });
      
      return response;
      
    } catch (error) {
      console.error(' Error validando token:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      console.log(' AuthService: Forgot password request for:', email);
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error(' Error en forgot password:', error);
      throw error;
    }
  },
};