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
      console.log(' AuthReducer LOGIN_SUCCESS:', {
        username: action.payload.user?.username,
        role: action.payload.user?.role,
        hasToken: !!action.payload.token
      });
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      console.log(' AuthReducer LOGOUT');
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
      console.log(' AuthReducer RESTORE_SESSION:', {
        username: action.payload.user?.username,
        role: action.payload.user?.role,
        hasToken: !!action.payload.token
      });
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        isLoading: false,
      };
    case 'CLEAR_AUTH':
      console.log(' AuthReducer CLEAR_AUTH');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
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
      console.log(' Restaurando sesión...');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      
      console.log(' Datos encontrados en storage:', {
        hasToken: !!token,
        hasUserData: !!userData,
        tokenLength: token?.length || 0
      });
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          //  VALIDAR QUE LOS DATOS SEAN VÁLIDOS
          if (!user.username || !user.role) {
            console.warn(' Datos de usuario inválidos en storage');
            await clearAuthData();
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
          }
          
          console.log(' Usuario restaurado:', {
            username: user.username,
            role: user.role,
            email: user.email,
            userId: user.userId
          });
          
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user, token },
          });
          
        } catch (parseError) {
          console.error(' Error parsing user data:', parseError);
          await clearAuthData();
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        console.log('ℹ No hay sesión guardada');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('❌ Error restoring session:', error);
      await clearAuthData();
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (userData, token) => {
    try {
      console.log(' Guardando login:', {
        username: userData.username,
        role: userData.role,
        email: userData.email,
        hasToken: !!token,
        tokenLength: token?.length || 0
      });
      
      // ⚠️ VALIDAR DATOS ANTES DE GUARDAR
      if (!userData || !token) {
        throw new Error('Datos de login inválidos');
      }
      
      if (!userData.username || !userData.role) {
        throw new Error('Datos de usuario incompletos');
      }
      
      // Crear objeto de usuario limpio
      const cleanUserData = {
        username: userData.username,
        email: userData.email,
        role: userData.role,
        userId: userData.userId || userData.id,
      };
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(cleanUserData));
      
      console.log(' Datos guardados en AsyncStorage');
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: cleanUserData, token },
      });
      
    } catch (error) {
      console.error(' Error saving login data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log(' Cerrando sesión...');
      await clearAuthData();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error(' Error during logout:', error);
      // Forzar logout aunque haya error
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      console.log(' Auth data cleared from storage');
    } catch (error) {
      console.error(' Error clearing auth data:', error);
    }
  };

  // FUNCIÓN PARA DEBUGGING
  const debugAuthState = () => {
    console.log('DEBUG AUTH STATE:', {
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      hasUser: !!state.user,
      hasToken: !!state.token,
      username: state.user?.username,
      role: state.user?.role,
      tokenLength: state.token?.length || 0
    });
  };

  const value = {
    ...state,
    login,
    logout,
    debugAuthState, // Para debugging
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