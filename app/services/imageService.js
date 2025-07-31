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

      // Opciones para expo-image-picker 15.0.7
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      console.log('Opening camera with options:', options);
      const result = await ImagePicker.launchCameraAsync(options);

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'No se pudo abrir la cámara: ' + error.message);
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

      // Opciones para expo-image-picker 15.0.7
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      console.log('Opening gallery with options:', options);
      const result = await ImagePicker.launchImageLibraryAsync(options);

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'No se pudo abrir la galería: ' + error.message);
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
      Alert.alert('Error', 'Error al seleccionar imagen: ' + error.message);
      return null;
    }
  },

  // Crear FormData para subida
  createFormData: (imageUri, fieldName = 'file') => {
    try {
      const formData = new FormData();
      
      // Obtener extensión del archivo
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1].toLowerCase();
      
      // Validar extensión
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const finalFileType = validExtensions.includes(fileType) ? fileType : 'jpg';
      
      formData.append(fieldName, {
        uri: imageUri,
        name: `image.${finalFileType}`,
        type: `image/${finalFileType}`,
      });

      return formData;
    } catch (error) {
      console.error('Error creating form data:', error);
      throw new Error('Error preparando la imagen para subir');
    }
  },

  // Subir imagen de producto
  uploadProductImage: async (productId, imageUri) => {
    try {
      console.log('Uploading product image:', { productId, imageUri });
      const formData = imageService.createFormData(imageUri);
      
      const response = await api.post(`/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos para imágenes
      });

      console.log('Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading product image:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw new Error('No se pudo subir la imagen del producto');
    }
  },

  // Subir imagen de categoría
  uploadCategoryImage: async (categoryId, imageUri) => {
    try {
      console.log('Uploading category image:', { categoryId, imageUri });
      const formData = imageService.createFormData(imageUri);
      
      const response = await api.post(`/categories/${categoryId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      console.log('Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading category image:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw new Error('No se pudo subir la imagen de la categoría');
    }
  },

  // Validar imagen antes de subir
  validateImage: (imageAsset) => {
    if (!imageAsset) {
      return { valid: false, error: 'No se seleccionó ninguna imagen' };
    }

    // Validar que tenga URI
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
    // La compresión se maneja automáticamente con la opción quality: 0.8
    // en las opciones de ImagePicker, no necesitamos librerías adicionales
    return imageUri;
  },
};