import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log('AuthReducer LOGIN_SUCCESS:', action.payload);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      console.log('AuthReducer LOGOUT');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'RESTORE_SESSION':
      console.log('AuthReducer RESTORE_SESSION:', action.payload);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      console.log('Restaurando sesión...');
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      
      console.log('Token encontrado:', !!token);
      console.log('Datos de usuario encontrados:', !!userData);
      
      if (token && userData) {
        const user = JSON.parse(userData);
        console.log('Usuario restaurado:', {
          username: user.username,
          role: user.role,
          email: user.email
        });
        
        dispatch({
          type: 'RESTORE_SESSION',
          payload: { user, token },
        });
      } else {
        console.log('No hay sesión guardada');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (userData, token) => {
    try {
      console.log('Guardando login:', {
        username: userData.username,
        role: userData.role,
        email: userData.email
      });
      
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: userData, token },
      });
    } catch (error) {
      console.error('Error saving login data:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('Cerrando sesión...');
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};