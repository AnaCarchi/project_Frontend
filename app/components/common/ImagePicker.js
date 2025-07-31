import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import { imageService } from '../../services/imageService';
import Card from './Card';

export default function ImagePickerComponent({
  imageUri,
  onImageSelected,
  onImageUploaded,
  placeholder = 'Seleccionar imagen',
  style,
  disabled = false,
  uploadFunction, // Función para subir la imagen
  entityId, // ID del producto/categoría
  showUploadButton = false,
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSelectImage = async () => {
    if (disabled || loading) return;

    console.log('=== SELECCIONANDO IMAGEN ===');
    setLoading(true);
    
    try {
      const imageResult = await imageService.pickImage();
      console.log('Imagen seleccionada:', imageResult);
      
      if (imageResult) {
        // Validar imagen
        const validation = imageService.validateImage(imageResult);
        if (!validation.valid) {
          Alert.alert('Error', validation.error);
          return;
        }

        console.log('Imagen validada correctamente');

        // Comprimir imagen si es necesario
        const compressedUri = await imageService.compressImage(imageResult.uri);
        
        console.log('URI final:', compressedUri);
        
        if (onImageSelected) {
          onImageSelected(compressedUri, imageResult);
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Error al seleccionar la imagen: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (!imageUri || !uploadFunction || !entityId || uploading) return;

    console.log('=== SUBIENDO IMAGEN ===');
    console.log('Entity ID:', entityId);
    console.log('Image URI:', imageUri);
    
    setUploading(true);
    try {
      const result = await uploadFunction(entityId, imageUri);
      console.log('Upload result:', result);
      
      if (onImageUploaded) {
        onImageUploaded(result);
      }
      Alert.alert('Éxito', 'Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleTestConnection = async () => {
    console.log('=== PROBANDO CONEXION ===');
    Alert.alert(
      'Prueba de Conexión',
      'Probando conexión con el servidor...',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Probar',
          onPress: async () => {
            try {
              const result = await imageService.testConnection();
              Alert.alert(
                result.success ? 'Éxito' : 'Error',
                result.message
              );
            } catch (error) {
              Alert.alert('Error', 'Error en la prueba: ' + error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <Card style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.imageContainer, disabled && styles.disabled]}
        onPress={handleSelectImage}
        disabled={disabled || loading}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons
              name="camera-plus"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Procesando...</Text>
          </View>
        )}

        {/* Botón para cambiar imagen */}
        {imageUri && !loading && (
          <View style={styles.changeButton}>
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              color={colors.surface}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Botones de acción */}
      <View style={styles.actions}>
        {imageUri && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onImageSelected && onImageSelected(null)}
            disabled={loading || uploading}
          >
            <MaterialCommunityIcons name="delete" size={16} color={colors.error} />
            <Text style={styles.removeButtonText}>Eliminar</Text>
          </TouchableOpacity>
        )}

        {showUploadButton && imageUri && uploadFunction && entityId && (
          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={handleUploadImage}
            disabled={uploading || loading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <MaterialCommunityIcons name="upload" size={16} color={colors.surface} />
            )}
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Subiendo...' : 'Subir'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Botón de prueba de conexión - solo en desarrollo */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestConnection}
            disabled={loading || uploading}
          >
            <MaterialCommunityIcons name="wifi" size={16} color={colors.primary} />
            <Text style={styles.testButtonText}>Test</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Información de debug en desarrollo */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Debug Info:</Text>
          <Text style={styles.debugText}>URI: {imageUri ? 'Set' : 'None'}</Text>
          <Text style={styles.debugText}>Entity ID: {entityId || 'None'}</Text>
          <Text style={styles.debugText}>Upload Function: {uploadFunction ? 'Set' : 'None'}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
  },
  disabled: {
    opacity: 0.6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.primary,
  },
  changeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.error,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  uploadButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  uploadButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.surface,
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  testButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.primary,
  },
  debugInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  debugText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});