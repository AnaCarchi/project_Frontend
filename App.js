import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [message, setMessage] = React.useState('App cargada correctamente!');

  const testBackend = async () => {
    try {
      setMessage('Probando backend...');
      const response = await fetch('http://192.168.100.7:8080/api/auth/admin-code-info');
      const data = await response.json();
      setMessage(' Backend conectado: ' + JSON.stringify(data.codes));
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Catálogo Ropa</Text>
      <Text style={styles.message}>{message}</Text>
      
      <TouchableOpacity style={styles.button} onPress={testBackend}>
        <Text style={styles.buttonText}>Probar Backend</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


