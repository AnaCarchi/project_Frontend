import { DefaultTheme } from 'react-native-paper';
import { colors } from './colors';

export { colors } from './colors'; // Re-exportar colores para fácil acceso

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
    onPrimary: colors.textOnPrimary,
    onSecondary: colors.textOnSecondary,
    onSurface: colors.text,
    onBackground: colors.text,
    onError: colors.textOnPrimary,
  },
  roundness: 8, // Bordes redondeados
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System', // Fuente del sistema
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};

// Tema oscuro (para futuras implementaciones)
export const darkTheme = {
  ...theme,
  dark: true,
  colors: {
    ...theme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
  },
};

// Configuración de elevación/sombras
export const elevation = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  extraLarge: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

// Espaciado consistente
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Bordes redondeados
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  extraLarge: 16,
  round: 50,
};

// Tamaños de fuente
export const fontSize = {
  caption: 12,
  body2: 14,
  body1: 16,
  subtitle2: 14,
  subtitle1: 16,
  h6: 20,
  h5: 24,
  h4: 28,
  h3: 32,
  h2: 36,
  h1: 40,
};