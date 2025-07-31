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

      const options = {
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

  // CRITICAL FIX: Crear FormData correctamente
  createFormData: (imageUri, fieldName = 'file') => {
    try {
      console.log('=== CREANDO FORMDATA ===');
      console.log('imageUri:', imageUri);
      console.log('fieldName:', fieldName);

      const formData = new FormData();
      
      // Obtener extensión del archivo
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1].toLowerCase();
      
      // Validar extensión
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const finalFileType = validExtensions.includes(fileType) ? fileType : 'jpg';
      
      // CRITICAL FIX: Formato correcto para React Native FormData
      const fileObject = {
        uri: imageUri,
        name: `image.${finalFileType}`,
        type: `image/${finalFileType}`,
      };

      console.log('File object:', fileObject);
      
      formData.append(fieldName, fileObject);

      console.log('FormData created successfully');
      console.log('FormData boundary:', formData._boundary); // Debug info
      
      return formData;
    } catch (error) {
      console.error('Error creating form data:', error);
      throw new Error('Error preparando la imagen para subir');
    }
  },

  // CRITICAL FIX: Subir imagen de producto con configuración correcta
  uploadProductImage: async (productId, imageUri) => {
    try {
      console.log('=== UPLOAD PRODUCTO ===');
      console.log('Product ID:', productId);
      console.log('Image URI:', imageUri);
      
      const formData = imageService.createFormData(imageUri, 'file');
      
      console.log('Enviando request a:', `/products/${productId}/image`);
      
      // CRITICAL FIX: Configuración específica para FormData
      const response = await api.post(`/products/${productId}/image`, formData, {
        headers: {
          // NO establecer Content-Type manualmente
          // Axios y el navegador lo configurarán automáticamente
        },
        timeout: 60000, // 60 segundos para uploads
        transformRequest: [(data) => {
          // Retornar data sin transformar para FormData
          return data;
        }],
      });

      console.log('=== UPLOAD EXITOSO ===');
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== ERROR EN UPLOAD ===');
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      if (error.request) {
        console.error('Request config:', error.request);
      }
      throw new Error('No se pudo subir la imagen del producto');
    }
  },

  // CRITICAL FIX: Subir imagen de categoría con configuración correcta
  uploadCategoryImage: async (categoryId, imageUri) => {
    try {
      console.log('=== UPLOAD CATEGORIA ===');
      console.log('Category ID:', categoryId);
      console.log('Image URI:', imageUri);
      
      const formData = imageService.createFormData(imageUri, 'file');
      
      console.log('Enviando request a:', `/categories/${categoryId}/image`);
      
      // CRITICAL FIX: Configuración específica para FormData
      const response = await api.post(`/categories/${categoryId}/image`, formData, {
        headers: {
          // NO establecer Content-Type manualmente
          // Axios y el navegador lo configurarán automáticamente
        },
        timeout: 60000, // 60 segundos para uploads
        transformRequest: [(data) => {
          // Retornar data sin transformar para FormData
          return data;
        }],
      });

      console.log('=== UPLOAD EXITOSO ===');
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== ERROR EN UPLOAD ===');
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
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
    // La compresión se maneja automáticamente con la opción quality: 0.8
    return imageUri;
  },

  // Método de prueba para verificar conectividad
  testConnection: async () => {
    try {
      console.log('=== TEST DE CONEXION ===');
      
      const response = await api.get('/products');
      
      console.log('Conexión exitosa');
      console.log('Status:', response.status);
      console.log('Productos encontrados:', response.data?.length || 0);
      
      return {
        success: true,
        message: `Conexión exitosa. Productos: ${response.data?.length || 0}`,
        productsCount: response.data?.length || 0
      };
    } catch (error) {
      console.error('=== ERROR DE CONEXION ===');
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      
      return {
        success: false,
        message: 'Error de conexión: ' + error.message,
        error: error
      };
    }
  },

  // NUEVO: Método de prueba específico para uploads
  testUploadEndpoint: async () => {
    try {
      console.log('=== TEST DE UPLOAD ENDPOINT ===');
      
      // Crear un FormData de prueba simple
      const testFormData = new FormData();
      testFormData.append('test', 'true');
      
      const response = await api.post('/test-upload', testFormData, {
        headers: {
          // NO establecer Content-Type
        },
        timeout: 30000,
      });
      
      console.log('Endpoint de upload accesible');
      console.log('Response:', response.data);
      
      return {
        success: true,
        message: 'Endpoint de upload funcional',
        data: response.data
      };
    } catch (error) {
      console.error('=== ERROR EN TEST UPLOAD ===');
      console.error('Error:', error.message);
      
      return {
        success: false,
        message: 'Error en endpoint: ' + error.message,
        error: error
      };
    }
  }
};