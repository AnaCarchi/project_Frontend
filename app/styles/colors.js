export const colors = {
  // Colores principales
  primary: '#E91E63',         // Rosa principal (como en la imagen)
  primaryLight: '#F48FB1',    // Rosa claro
  primaryDark: '#AD1457',     // Rosa oscuro
  
  // Colores secundarios
  secondary: '#F8BBD9',       // Rosa muy claro
  secondaryLight: '#FCE4EC',  // Rosa pastel
  secondaryDark: '#F48FB1',   // Rosa medio
  
  // Acento
  accent: '#9C27B0',          // Púrpura (acento)
  accentLight: '#CE93D8',     // Púrpura claro
  accentDark: '#7B1FA2',      // Púrpura oscuro
  
  // Colores neutros
  background: '#F5F5F5',      // Gris muy claro (fondo principal)
  surface: '#FFFFFF',         // Blanco (tarjetas, formularios)
  surfaceVariant: '#FAFAFA',  // Blanco con tinte gris
  
  // Textos
  text: '#212121',            // Negro principal
  textSecondary: '#757575',   // Gris medio
  textTertiary: '#BDBDBD',    // Gris claro
  textOnPrimary: '#FFFFFF',   // Texto sobre color primario
  textOnSecondary: '#212121', // Texto sobre color secundario
  
  // Estados
  error: '#F44336',           // Rojo error
  errorLight: '#FFCDD2',      // Rojo claro
  errorDark: '#D32F2F',       // Rojo oscuro
  
  success: '#4CAF50',         // Verde éxito
  successLight: '#C8E6C9',    // Verde claro
  successDark: '#388E3C',     // Verde oscuro
  
  warning: '#FF9800',         // Naranja advertencia
  warningLight: '#FFE0B2',    // Naranja claro
  warningDark: '#F57C00',     // Naranja oscuro
  
  info: '#2196F3',            // Azul información
  infoLight: '#BBDEFB',       // Azul claro
  infoDark: '#1976D2',        // Azul oscuro
  
  // Bordes y divisores
  border: '#E0E0E0',          // Gris borde
  borderLight: '#F5F5F5',     // Gris borde claro
  borderDark: '#BDBDBD',      // Gris borde oscuro
  divider: '#EEEEEE',         // Líneas divisoras
  
  // Sombras
  shadow: '#000000',          // Negro para sombras
  shadowLight: 'rgba(0,0,0,0.1)', // Sombra ligera
  shadowMedium: 'rgba(0,0,0,0.2)', // Sombra media
  shadowDark: 'rgba(0,0,0,0.3)',   // Sombra fuerte
  
  // Overlays y modales
  overlay: 'rgba(0,0,0,0.5)',     // Fondo semi-transparente
  overlayLight: 'rgba(0,0,0,0.3)', // Overlay ligero
  overlayDark: 'rgba(0,0,0,0.7)',  // Overlay oscuro
  
  // Estados de interacción
  pressed: 'rgba(233,30,99,0.1)',  // Color al presionar (primary con alpha)
  focused: 'rgba(233,30,99,0.2)',  // Color al enfocar
  hovered: 'rgba(233,30,99,0.05)', // Color al hover (web)
  selected: 'rgba(233,30,99,0.15)', // Color seleccionado
  
  // Gradientes (colores para LinearGradient)
  gradientPrimary: ['#E91E63', '#F8BBD9'],
  gradientSecondary: ['#9C27B0', '#E91E63'],
  gradientAccent: ['#F8BBD9', '#9C27B0'],
  gradientBackground: ['#FAFAFA', '#F5F5F5'],
  
  // Colores específicos para componentes
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  input: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputFocused: '#E91E63',
  inputError: '#F44336',
  
  // Badges y labels
  badgeSuccess: '#4CAF50',
  badgeWarning: '#FF9800',
  badgeError: '#F44336',
  badgeInfo: '#2196F3',
  badgePrimary: '#E91E63',
  badgeSecondary: '#757575',
  
  // Colores para gráficos y charts
  chart: ['#E91E63', '#9C27B0', '#2196F3', '#4CAF50', '#FF9800', '#F44336'],
  chartPrimary: '#E91E63',
  chartSecondary: '#9C27B0',
  chartTertiary: '#2196F3',
  
  // Estados específicos
  online: '#4CAF50',
  offline: '#757575',
  away: '#FF9800',
  busy: '#F44336',
  
  // Transparencias útiles
  transparent: 'transparent',
  black10: 'rgba(0,0,0,0.1)',
  black20: 'rgba(0,0,0,0.2)',
  black30: 'rgba(0,0,0,0.3)',
  black50: 'rgba(0,0,0,0.5)',
  white10: 'rgba(255,255,255,0.1)',
  white20: 'rgba(255,255,255,0.2)',
  white30: 'rgba(255,255,255,0.3)',
  white50: 'rgba(255,255,255,0.5)',
  primary10: 'rgba(233,30,99,0.1)',
  primary20: 'rgba(233,30,99,0.2)',
  primary30: 'rgba(233,30,99,0.3)',
};

// Función para obtener color con opacidad
export const getColorWithOpacity = (color, opacity) => {
  // Si el color ya tiene formato rgba, extraer los valores RGB
  if (color.startsWith('rgba')) {
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
    if (rgbaMatch) {
      return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
    }
  }
  
  // Si el color es hex, convertir a rgba
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return color;
};

// Función para tema oscuro (opcional para futuras implementaciones)
export const darkColors = {
  ...colors,
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  textTertiary: '#888888',
  border: '#444444',
  card: '#1E1E1E',
  input: '#2D2D2D',
  inputBorder: '#444444',
};

// Exportar por defecto los colores claros
export default colors;