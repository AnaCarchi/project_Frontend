import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

export default function Header({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  backgroundColor = colors.primary,
  textColor = colors.surface,
}) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {leftIcon && (
            <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
              <MaterialCommunityIcons
                name={leftIcon}
                size={Math.min(width * 0.06, 24)} // Responsive icon size
                color={textColor}
              />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
              <MaterialCommunityIcons
                name={rightIcon}
                size={Math.min(width * 0.06, 24)} // Responsive icon size
                color={textColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04, // 4% del ancho
    paddingVertical: height * 0.015, // 1.5% del alto
    minHeight: Math.max(height * 0.07, 56), // Mínimo 56px
  },
  leftSection: {
    width: Math.max(width * 0.1, 40), // Mínimo 40px
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.02, // 2% del ancho
  },
  rightSection: {
    width: Math.max(width * 0.1, 40), // Mínimo 40px
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: Math.min(width * 0.02, 8), // Responsive padding
    borderRadius: Math.min(width * 0.04, 16), // Responsive border radius
    minWidth: Math.max(width * 0.08, 32), // Touch target mínimo
    minHeight: Math.max(width * 0.08, 32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Math.min(width * 0.045, 18), // Responsive font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(width * 0.03, 12), // Responsive font size
    opacity: 0.8,
    textAlign: 'center',
    marginTop: height * 0.002, // 0.2% del alto
  },
});