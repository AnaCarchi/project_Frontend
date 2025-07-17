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

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    adminCode: '', // NUEVO: Campo para código de admin
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

    // VALIDACIÓN ESPECÍFICA PARA ADMINISTRADORES
    if (formData.role === 'ADMIN' && !formData.adminCode.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Se requiere código de administrador',
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
        adminCode: formData.role === 'ADMIN' ? formData.adminCode : undefined,
      };

      const response = await authService.register(registerData);
      await login(response.data, response.data.token);
      
      Toast.show({
        type: 'success',
        text1: 'Registro exitoso',
        text2: `¡Bienvenido ${response.data.username}!`,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
      Toast.show({
        type: 'error',
        text1: 'Error en el registro',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (newRole) => {
    updateFormData('role', newRole);
    // Limpiar código de admin si cambia a usuario normal
    if (newRole === 'USER') {
      updateFormData('adminCode', '');
    }
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

            {/* SELECTOR DE ROL */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Tipo de cuenta:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'USER' && styles.roleButtonActive
                  ]}
                  onPress={() => handleRoleChange('USER')}
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
                  onPress={() => handleRoleChange('ADMIN')}
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

            {/* CAMPO DE CÓDIGO DE ADMINISTRADOR - Solo visible si selecciona ADMIN */}
            {formData.role === 'ADMIN' && (
              <View style={styles.adminCodeContainer}>
                <Input
                  label="Código de Administrador *"
                  value={formData.adminCode}
                  onChangeText={(text) => updateFormData('adminCode', text)}
                  leftIcon="shield-key"
                  placeholder="Ingresa el código secreto"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                <View style={styles.codeWarning}>
                  <MaterialCommunityIcons 
                    name="alert-circle" 
                    size={16} 
                    color={colors.warning} 
                  />
                  <Text style={styles.codeWarningText}>
                    Códigos válidos:{'\n'}
                    • TIENDA2024{'\n'}
                    • MiTienda_Admin_2024#{'\n'}
                    • CATALOGO_ADMIN_2024!
                  </Text>
                </View>
              </View>
            )}

            {/* Descripción del rol seleccionado */}
            <View style={styles.roleDescription}>
              <MaterialCommunityIcons 
                name="information" 
                size={16} 
                color={colors.textSecondary} 
              />
              <Text style={styles.roleDescriptionText}>
                {formData.role === 'ADMIN' 
                  ? 'Acceso completo: gestión de productos, categorías, usuarios y reportes'
                  : 'Acceso básico: visualización de productos y categorías'
                }
              </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  roleButtonTextActive: {
    color: colors.surface,
  },
  adminCodeContainer: {
    marginBottom: 16,
  },
  codeWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warning + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  codeWarningText: {
    flex: 1,
    fontSize: 12,
    color: colors.warning,
    marginLeft: 8,
    lineHeight: 16,
    fontWeight: '500',
  },
  roleDescription: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  roleDescriptionText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    lineHeight: 16,
  },
  registerButton: {
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.textSecondary,
  },
});