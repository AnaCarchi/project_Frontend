import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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

    setLoading(true);
    try {
      const imageResult = await imageService.pickImage();
      if (imageResult) {
        // Validar imagen
        const validation = imageService.validateImage(imageResult);
        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        // Comprimir imagen si es necesario
        const compressedUri = await imageService.compressImage(imageResult.uri);
        
        if (onImageSelected) {
          onImageSelected(compressedUri, imageResult);
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      alert('Error al seleccionar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (!imageUri || !uploadFunction || !entityId || uploading) return;

    setUploading(true);
    try {
      const result = await uploadFunction(entityId, imageUri);
      if (onImageUploaded) {
        onImageUploaded(result);
      }
      alert('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
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
      </View>
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
    marginTop: 12,
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
});
