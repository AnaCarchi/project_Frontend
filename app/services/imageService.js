// app/services/imageService.js - VERSIÓN CORREGIDA COMPLETA

import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import api from './api';

export const imageService = {
  // Solicitar permisos de cámara y galería
  requestPermissions: async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return {
        camera: cameraPermission.status === 'granted',
        mediaLibrary: mediaLibraryPermission.status === 'granted',
      };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return { camera: false, mediaLibrary: false };
    }
  },

  // Mostrar opciones para seleccionar imagen
  showImagePickerOptions: () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Seleccionar Imagen',
        'Elige una opción',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
          {
            text: 'Cámara',
            onPress: () => resolve('camera'),
          },
          {
            text: 'Galería',
            onPress: () => resolve('gallery'),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    });
  },

  // Abrir cámara
  openCamera: async () => {
    try {
      const permissions = await imageService.requestPermissions();
      if (!permissions.camera) {
        Alert.alert('Permisos', 'Se necesitan permisos de cámara para esta función');
        return null;
      }

      const options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false, // NO necesitamos base64 aquí
      };

      const result = await ImagePicker.launchCameraAsync(options);

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'No se pudo abrir la cámara');
      return null;
    }
  },

  // Abrir galería
  openGallery: async () => {
    try {
      const permissions = await imageService.requestPermissions();
      if (!permissions.mediaLibrary) {
        Alert.alert('Permisos', 'Se necesitan permisos de galería para esta función');
        return null;
      }

      const options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false, // NO necesitamos base64 aquí
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'No se pudo abrir la galería');
      return null;
    }
  },

  // Seleccionar imagen (cámara o galería)
  pickImage: async () => {
    try {
      const option = await imageService.showImagePickerOptions();
      if (!option) return null;

      let imageResult = null;
      if (option === 'camera') {
        imageResult = await imageService.openCamera();
      } else if (option === 'gallery') {
        imageResult = await imageService.openGallery();
      }

      return imageResult;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Error al seleccionar imagen');
      return null;
    }
  },

  // Crear FormData correctamente para React Native
  createFormData: (imageUri, fieldName = 'file') => {
    try {
      const formData = new FormData();
      
      // Obtener extensión del archivo
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1].toLowerCase();
      
      // Validar extensión
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const finalFileType = validExtensions.includes(fileType) ? fileType : 'jpg';
      
      // FORMATO CORRECTO para React Native FormData
      const fileObject = {
        uri: imageUri,
        name: `image_${Date.now()}.${finalFileType}`,
        type: `image/${finalFileType === 'jpg' ? 'jpeg' : finalFileType}`,
      };
      
      formData.append(fieldName, fileObject);
      
      console.log('FormData creado:', {
        uri: imageUri,
        name: fileObject.name,
        type: fileObject.type
      });
      
      return formData;
    } catch (error) {
      console.error('Error creating form data:', error);
      throw new Error('Error preparando la imagen para subir');
    }
  },

  // Subir imagen de producto - CORREGIDO
  uploadProductImage: async (productId, imageUri) => {
    try {
      console.log('=== SUBIENDO IMAGEN DE PRODUCTO ===');
      console.log('Product ID:', productId);
      console.log('Image URI:', imageUri);
      
      const formData = imageService.createFormData(imageUri, 'file');
      
      console.log('Enviando POST a:', `/products/${productId}/image`);
      
      const response = await api.post(`/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000, // 60 segundos
      });

      console.log('✅ Imagen subida exitosamente:', response.data);
      
      // Mostrar mensaje de éxito
      Alert.alert(
        'Éxito',
        'Imagen subida correctamente',
        [{ text: 'OK' }]
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Error uploading product image:', error);
      
      let errorMessage = 'No se pudo subir la imagen del producto';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Subir imagen de categoría - CORREGIDO
  uploadCategoryImage: async (categoryId, imageUri) => {
    try {
      console.log('=== SUBIENDO IMAGEN DE CATEGORÍA ===');
      console.log('Category ID:', categoryId);
      console.log('Image URI:', imageUri);
      
      const formData = imageService.createFormData(imageUri, 'file');
      
      console.log('Enviando POST a:', `/categories/${categoryId}/image`);
      
      const response = await api.post(`/categories/${categoryId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000, // 60 segundos
      });

      console.log('✅ Imagen de categoría subida exitosamente:', response.data);
      
      // Mostrar mensaje de éxito
      Alert.alert(
        'Éxito',
        'Imagen de categoría subida correctamente',
        [{ text: 'OK' }]
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Error uploading category image:', error);
      
      let errorMessage = 'No se pudo subir la imagen de la categoría';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Validar imagen antes de subir
  validateImage: (imageAsset) => {
    if (!imageAsset) {
      return { valid: false, error: 'No se seleccionó ninguna imagen' };
    }

    if (!imageAsset.uri) {
      return { valid: false, error: 'La imagen no es válida' };
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageAsset.fileSize && imageAsset.fileSize > maxSize) {
      return { valid: false, error: 'La imagen es demasiado grande (máximo 10MB)' };
    }

    // Validar dimensiones mínimas
    if (imageAsset.width && imageAsset.height) {
      if (imageAsset.width < 50 || imageAsset.height < 50) {
        return { valid: false, error: 'La imagen debe ser al menos de 50x50 píxeles' };
      }
    }

    return { valid: true };
  },

  // Comprimir imagen si es muy grande
  compressImage: async (imageUri) => {
    // Por ahora retornamos la URI original
    // Podrías implementar compresión con expo-image-manipulator
    return imageUri;
  },

  // Método de prueba para verificar conectividad
  testConnection: async () => {
    try {
      const response = await api.get('/products');
      
      return {
        success: true,
        message: `Conexión exitosa. Productos encontrados: ${response.data?.length || 0}`,
        productsCount: response.data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión: ' + (error.message || 'Error desconocido'),
        error: error
      };
    }
  },
};