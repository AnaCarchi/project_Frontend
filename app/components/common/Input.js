import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off' : 'eye'}
            size={Math.min(width * 0.05, 20)} // Responsive icon size
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    
    if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={rightIcon}
            size={Math.min(width * 0.05, 20)} // Responsive icon size
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error,
        !editable && styles.disabled,
        multiline && styles.multilineContainer,
      ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={leftIcon}
              size={Math.min(width * 0.05, 20)} // Responsive icon size
              color={colors.textSecondary}
            />
          </View>
        )}
        <TextInput
          style={[
            styles.input, 
            inputStyle,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          placeholderTextColor={colors.textSecondary}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {renderRightIcon()}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: height * 0.02, // 2% del alto
  },
  label: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '600',
    color: colors.text,
    marginBottom: height * 0.01, // 1% del alto
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Math.min(width * 0.02, 8), // Responsive border radius
    paddingHorizontal: width * 0.03, // 3% del ancho
    minHeight: Math.max(height * 0.06, 48), // Mínimo 48px
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: height * 0.015, // 1.5% del alto
    minHeight: Math.max(height * 0.12, 96), // Mínimo 96px para multiline
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    color: colors.text,
    paddingVertical: height * 0.015, // 1.5% del alto
  },
  multilineInput: {
    minHeight: Math.max(height * 0.08, 64), // Mínimo 64px para texto multilinea
    textAlignVertical: 'top',
  },
  iconContainer: {
    marginHorizontal: width * 0.01, // 1% del ancho
    padding: width * 0.01, // 1% del ancho
  },
  errorText: {
    fontSize: Math.min(width * 0.03, 12), // Responsive font size
    color: colors.error,
    marginTop: height * 0.005, // 0.5% del alto
  },
});