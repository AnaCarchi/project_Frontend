import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Debug: Log para verificar el estado
  console.log('AppNavigator Debug:', {
    isAuthenticated,
    isLoading,
    user: user ? {
      username: user.username,
      role: user.role,
      email: user.email
    } : null
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Función para determinar si es admin
  const isAdmin = (userRole) => {
    if (!userRole) return false;
    // Manejar tanto "ROLE_ADMIN" como "ADMIN"
    return userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : isAdmin(user?.role) ? (
          <Stack.Screen name="Admin" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="User" component={UserNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}