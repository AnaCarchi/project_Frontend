import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { colors } from '../../styles/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      await login(response.data, response.data.token);
      
      Toast.show({
        type: 'success',
        text1: 'Bienvenido',
        text2: `Hola ${response.data.username}!`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error de autenticación',
        text2: error.response?.data?.message || 'Credenciales inválidas',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons 
                name="shopping" 
                size={60} 
                color={colors.surface} 
              />
            </View>
            <Text style={styles.title}>Catálogo Ropa</Text>
            <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Usuario"
              value={formData.username}
              onChangeText={(text) => updateFormData('username', text)}
              leftIcon="account"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Contraseña"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              leftIcon="lock"
              secureTextEntry
            />

            <View style={styles.optionsContainer}>
              <Button
                title="¿Olvidaste tu contraseña?"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('ForgotPassword')}
              />
            </View>

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <Button
                title="Regístrate aquí"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('Register')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
