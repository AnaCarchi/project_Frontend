import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

console.log('=== CONFIGURACION API ===');
console.log('Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos para uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Log de la request
      console.log('=== REQUEST ===');
      console.log('URL:', config.baseURL + config.url);
      console.log('Method:', config.method?.toUpperCase());
      
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token agregado');
      } else {
        console.log('No hay token disponible');
      }
      
      // CRITICAL FIX: Para FormData, eliminar Content-Type completamente
      if (config.data instanceof FormData) {
        console.log('FormData detectado - removiendo Content-Type header');
        delete config.headers['Content-Type'];
        // También asegurar que no hay headers conflictivos
        delete config.headers['content-type'];
        config.headers = {
          ...config.headers,
          'Content-Type': undefined
        };
        console.log('Headers después de limpiar:', config.headers);
      }
      
      console.log('Headers finales:', config.headers);
      
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('=== RESPONSE SUCCESS ===');
    console.log('Status:', response.status);
    console.log('URL:', response.config.url);
    if (response.data) {
      console.log('Data keys:', Object.keys(response.data));
    }
    return response;
  },
  async (error) => {
    console.log('=== RESPONSE ERROR ===');
    console.log('Message:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
      
      // Token expirado o inválido
      if (error.response.status === 401) {
        console.log('Token inválido - removiendo storage');
        await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      }
    } else if (error.request) {
      console.log('No response received');
      console.log('Request config:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;