import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Crear instancia de axios con configuración específica para móvil
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 segundos para uploads
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token y manejar FormData correctamente
api.interceptors.request.use(
  async (config) => {
    try {
      // Obtener token
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      //IMPORTANTE: Para FormData, NO establecer Content-Type
      // Axios lo establecerá automáticamente con el boundary correcto
      if (config.data instanceof FormData) {
        // Eliminar Content-Type para que axios lo maneje automáticamente
        delete config.headers['Content-Type'];
        
        console.log(' FormData detected, headers adjusted:');
        console.log('Authorization:', config.headers.Authorization ? 'SET' : 'NOT SET');
        console.log('Content-Type:', config.headers['Content-Type'] || 'AUTO (FormData)');
      } else {
        // Para requests normales, establecer Content-Type JSON
        config.headers['Content-Type'] = 'application/json';
      }
      
      console.log(' Request config:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        hasToken: !!config.headers.Authorization,
        contentType: config.headers['Content-Type'] || 'AUTO',
        isFormData: config.data instanceof FormData,
      });
      
    } catch (error) {
      console.error(' Error in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    console.error(' Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(' Response success:', {
      status: response.status,
      url: response.config.url,
      hasData: !!response.data,
    });
    return response;
  },
  async (error) => {
    console.log('❌ Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    
    if (error.response) {
      // Error con respuesta del servidor
      const { status, data } = error.response;
      
      console.log(`HTTP ${status} Error:`, data);
      
      // Token expirado o inválido
      if (status === 401) {
        console.log(' Token invalid, clearing storage...');
        await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
        // Aquí podrías disparar un evento para redirigir al login
      }
      
      // Error específico de uploads
      if (status === 413) {
        error.message = 'El archivo es demasiado grande';
      } else if (status === 415) {
        error.message = 'Tipo de archivo no soportado';
      } else if (status === 400 && data?.message) {
        error.message = data.message;
      }
      
    } else if (error.request) {
      // Error de red o timeout
      console.log(' Network error:', error.request);
      error.message = 'Error de conexión. Verifica tu internet y que el servidor esté funcionando.';
    } else {
      // Error de configuración
      console.log(' Setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;