import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { colors } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  ...props
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      default:
        baseStyle.push(styles.primary);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostText);
        break;
      default:
        baseStyle.push(styles.primaryText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.surface} />
      ) : (
        <>
          {Icon && <Icon style={styles.icon} />}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Math.min(width * 0.02, 8),
    paddingHorizontal: width * 0.04, // 4% del ancho
  },
  small: {
    paddingVertical: height * 0.01, // 1% del alto
    minHeight: Math.max(height * 0.045, 36), // Mínimo 36px
  },
  medium: {
    paddingVertical: height * 0.015, // 1.5% del alto
    minHeight: Math.max(height * 0.055, 44), // Mínimo 44px
  },
  large: {
    paddingVertical: height * 0.02, // 2% del alto
    minHeight: Math.max(height * 0.065, 52), // Mínimo 52px
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
  },
  mediumText: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
  },
  largeText: {
    fontSize: Math.min(width * 0.045, 18), // Responsive font size
  },
  primaryText: {
    color: colors.surface,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  icon: {
    marginRight: width * 0.02, // 2% del ancho
  },
});