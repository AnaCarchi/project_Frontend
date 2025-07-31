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

  // Crear FormData correctamente
  createFormData: (imageUri, fieldName = 'file') => {
    try {
      const formData = new FormData();
      
      // Obtener extensión del archivo
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1].toLowerCase();
      
      // Validar extensión
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const finalFileType = validExtensions.includes(fileType) ? fileType : 'jpg';
      
      // Formato correcto para React Native FormData
      const fileObject = {
        uri: imageUri,
        name: `image.${finalFileType}`,
        type: `image/${finalFileType}`,
      };
      
      formData.append(fieldName, fileObject);
      
      return formData;
    } catch (error) {
      console.error('Error creating form data:', error);
      throw new Error('Error preparando la imagen para subir');
    }
  },

  // Subir imagen de producto
  uploadProductImage: async (productId, imageUri) => {
    try {
      const formData = imageService.createFormData(imageUri, 'file');
      
      const response = await api.post(`/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw new Error('No se pudo subir la imagen del producto');
    }
  },

  // Subir imagen de categoría
  uploadCategoryImage: async (categoryId, imageUri) => {
    try {
      const formData = imageService.createFormData(imageUri, 'file');
      
      const response = await api.post(`/categories/${categoryId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading category image:', error);
      throw new Error('No se pudo subir la imagen de la categoría');
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
      if (imageAsset.width < 100 || imageAsset.height < 100) {
        return { valid: false, error: 'La imagen debe ser al menos de 100x100 píxeles' };
      }
    }

    return { valid: true };
  },

  // Comprimir imagen si es muy grande
  compressImage: async (imageUri) => {
    return imageUri;
  },

  // Método de prueba para verificar conectividad
  testConnection: async () => {
    try {
      const response = await api.get('/products');
      
      return {
        success: true,
        message: `Conexión exitosa. Productos: ${response.data?.length || 0}`,
        productsCount: response.data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión: ' + error.message,
        error: error
      };
    }
  },
};