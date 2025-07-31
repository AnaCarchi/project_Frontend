import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
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

  const { login, debugAuthState } = useAuth();

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
      console.log('Iniciando proceso de login...');
      console.log(' Credenciales:', {
        username: formData.username,
        passwordLength: formData.password.length
      });

      // 1. REALIZAR LOGIN
      const response = await authService.login(formData);
      
      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: Object.keys(response.data || {})
      });

      // 2. VALIDAR RESPUESTA
      if (!response.data) {
        throw new Error('Respuesta vacía del servidor');
      }

      const { token, username, email, role, userId } = response.data;

      console.log('🔍 Datos recibidos:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        username,
        email,
        role,
        userId
      });

      // 3. VALIDAR TOKEN
      if (!token) {
        throw new Error('Token no recibido del servidor');
      }

      if (token.length < 50) {
        throw new Error('Token parece inválido (muy corto)');
      }

      // 4. VALIDAR DATOS DE USUARIO
      if (!username || !role) {
        throw new Error('Datos de usuario incompletos');
      }

      // 5. GUARDAR EN CONTEXT
      const userData = {
        username,
        email,
        role,
        userId: userId || null,
      };

      console.log(' Guardando en AuthContext:', userData);

      await login(userData, token);

      // 6. DEBUG DEL ESTADO
      setTimeout(() => {
        debugAuthState();
      }, 1000);

      console.log(' Login completado exitosamente');
      
      Toast.show({
        type: 'success',
        text1: 'Bienvenido',
        text2: `Hola ${username}! (${role})`,
      });

    } catch (error) {
      console.error(' Error durante el login:', error);
      
      let errorMessage = 'Error de conexión';
      
      if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.response?.status === 403) {
        errorMessage = 'Acceso denegado';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Error de autenticación',
        text2: errorMessage,
      });

      // Debug del error
      console.log('🔍 Debug del error:', {
        errorType: error.constructor.name,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        responseData: error.response?.data
      });

    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  //  FUNCIÓN DE DEBUG PARA TESTING
  const handleDebugLogin = () => {
    Alert.alert(
      'Debug Login',
      'Selecciona un usuario para probar:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Admin (TIENDA2024)',
          onPress: () => {
            setFormData({ username: 'admin', password: 'admin123' });
          },
        },
        {
          text: 'Usuario Normal',
          onPress: () => {
            setFormData({ username: 'user', password: 'user123' });
          },
        },
      ]
    );
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

            {/* ⚠️ BOTÓN DE DEBUG SOLO EN DESARROLLO */}
            {__DEV__ && (
              <Button
                title="🔧 Debug Login"
                variant="outline"
                size="small"
                onPress={handleDebugLogin}
                style={styles.debugButton}
              />
            )}

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
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  logoCircle: {
    width: Math.min(width * 0.3, 120),
    height: Math.min(width * 0.3, 120),
    borderRadius: Math.min(width * 0.15, 60),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.025,
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
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16),
    color: colors.surface,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: Math.min(width * 0.05, 20),
    padding: width * 0.05,
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
    marginBottom: height * 0.03,
  },
  loginButton: {
    marginBottom: height * 0.025,
  },
  debugButton: {
    marginBottom: height * 0.015,
    borderColor: colors.warning,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: Math.min(width * 0.035, 14),
  },
});