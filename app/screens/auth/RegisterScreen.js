import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { colors } from '../../styles/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Las contraseñas no coinciden',
      });
      return false;
    }

    if (formData.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La contraseña debe tener al menos 6 caracteres',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa un email válido',
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await authService.register(registerData);
      await login(response.data, response.data.token);
      
      Toast.show({
        type: 'success',
        text1: 'Registro exitoso',
        text2: `¡Bienvenido ${response.data.username}!`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error en el registro',
        text2: error.response?.data?.message || 'Error al crear la cuenta',
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
      colors={[colors.secondary, colors.primary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={colors.surface}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Crear Cuenta</Text>
            <View style={{ width: 48 }} />
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Nombre de usuario"
              value={formData.username}
              onChangeText={(text) => updateFormData('username', text)}
              leftIcon="account"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              leftIcon="email"
              keyboardType="email-address"
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

            <Input
              label="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              leftIcon="lock-check"
              secureTextEntry
            />

            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Tipo de cuenta:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'USER' && styles.roleButtonActive
                  ]}
                  onPress={() => updateFormData('role', 'USER')}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color={formData.role === 'USER' ? colors.surface : colors.primary}
                  />
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'USER' && styles.roleButtonTextActive
                  ]}>
                    Usuario
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'ADMIN' && styles.roleButtonActive
                  ]}
                  onPress={() => updateFormData('role', 'ADMIN')}
                >
                  <MaterialCommunityIcons
                    name="shield-account"
                    size={20}
                    color={formData.role === 'ADMIN' ? colors.surface : colors.primary}
                  />
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'ADMIN' && styles.roleButtonTextActive
                  ]}>
                    Administrador
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <Button
                title="Inicia sesión"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}