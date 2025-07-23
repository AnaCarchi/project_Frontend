import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Providers
import { AuthProvider } from './app/context/AuthContext';
import { ProductProvider } from './app/context/ProductContext';
import { ThemeProvider } from './app/context/ThemeContext';

// Navigation
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <AppNavigator />
            <StatusBar style="auto" />
            <Toast />
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}