import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [message, setMessage] = useState('🚀 App funcionando en SDK 53');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    setMessage('🔄 Probando conexión...');
    
    try {
      const response = await fetch('http://192.168.100.7:8080/api/auth/admin-code-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage('✅ Backend conectado!');
        Alert.alert('Éxito', `Backend funcionando: ${JSON.stringify(data)}`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      Alert.alert('Error', `No se pudo conectar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showInfo = () => {
    Alert.alert(
      'Información',
      '✅ Expo SDK: 53\n✅ Compatible con Expo Go 53\n✅ Sin dependencias problemáticas\n✅ Funcionando correctamente'
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Catálogo Ropa</Text>
        <Text style={styles.subtitle}>SDK 53 - Sin Conflictos</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusMessage}>{message}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={testBackend}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Conectando...' : '🔗 Probar Backend'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoButton} onPress={showInfo}>
          <Text style={styles.infoButtonText}>ℹ️ Información</Text>
        </TouchableOpacity>

        <View style={styles.successCard}>
          <Text style={styles.successTitle}>✅ Estado: Funcionando</Text>
          <Text style={styles.successText}>• Sin pantalla azul</Text>
          <Text style={styles.successText}>• Sin conflictos de dependencias</Text>
          <Text style={styles.successText}>• Compatible con Expo Go 53</Text>
          <Text style={styles.successText}>• Listo para desarrollo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusMessage: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E91E63',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    color: '#388E3C',
    marginBottom: 6,
  },
});