import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

export default function Card({
  children,
  style,
  onPress,
  disabled = false,
  shadow = true,
  ...props
}) {
  const cardStyle = [
    styles.card,
    shadow && styles.shadow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: Math.min(width * 0.03, 12), // Responsive border radius
    padding: width * 0.04, // 4% del ancho
    marginVertical: height * 0.005, // 0.5% del alto
    marginHorizontal: width * 0.005, // 0.5% del ancho
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: Math.min(height * 0.0025, 2), // Responsive shadow
    },
    shadowOpacity: 0.1,
    shadowRadius: Math.min(width * 0.01, 4), // Responsive shadow radius
    elevation: 3,
  },
});