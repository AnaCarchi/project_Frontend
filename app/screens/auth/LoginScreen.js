import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
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

const { width, height } = Dimensions.get('window');

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
    paddingHorizontal: width * 0.05, // 5% del ancho
    paddingVertical: height * 0.03, // 3% del alto
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05, // 5% del alto
  },
  logoCircle: {
    width: Math.min(width * 0.3, 120), // 30% del ancho máximo 120px
    height: Math.min(width * 0.3, 120),
    borderRadius: Math.min(width * 0.15, 60),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.025, // 2.5% del alto
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: Math.min(height * 0.005, 4),
    },
    shadowOpacity: 0.3,
    shadowRadius: Math.min(width * 0.02, 8),
    elevation: 8,
  },
  title: {
    fontSize: Math.min(width * 0.08, 32), // Responsive font size
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: height * 0.01, // 1% del alto
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    color: colors.surface,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: Math.min(width * 0.05, 20), // Responsive border radius
    padding: width * 0.05, // 5% del ancho
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: Math.min(height * 0.005, 4),
    },
    shadowOpacity: 0.1,
    shadowRadius: Math.min(width * 0.02, 8),
    elevation: 5,
  },
  optionsContainer: {
    alignItems: 'flex-end',
    marginBottom: height * 0.03, // 3% del alto
  },
  loginButton: {
    marginBottom: height * 0.025, // 2.5% del alto
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap', // Permite que se envuelva en pantallas pequeñas
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
  },
});