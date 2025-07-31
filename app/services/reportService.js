// app/services/reportService.js - VERSIÓN CORREGIDA COMPLETA

import api from './api';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export const reportService = {
  // Solicitar permisos para guardar en almacenamiento
  requestStoragePermissions: async () => {
    try {
      if (Platform.OS === 'android') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status === 'granted';
      }
      return true;
    } catch (error) {
      console.error('Error requesting storage permissions:', error);
      return false;
    }
  },

  // Generar reporte de productos PDF - CORREGIDO
  generateProductsPdfReport: async () => {
    try {
      console.log('📊 Generando reporte PDF de productos...');
      
      const response = await api.get('/reports/products/pdf/mobile', {
        timeout: 120000, // 2 minutos para reportes
      });
      
      console.log('📋 Response status:', response.status);
      console.log('📋 Response data keys:', Object.keys(response.data || {}));
      
      if (response.data && response.data.success) {
        await reportService.handleReportDownload(response.data, 'PDF de Productos');
        return response.data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Error generating PDF report:', error);
      
      let errorMessage = 'Error generando reporte PDF';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      throw error;
    }
  },

  // Generar reporte de productos Excel - CORREGIDO
  generateProductsExcelReport: async () => {
    try {
      console.log('📊 Generando reporte Excel de productos...');
      
      const response = await api.get('/reports/products/excel/mobile', {
        timeout: 120000, // 2 minutos para reportes
      });
      
      if (response.data && response.data.success) {
        await reportService.handleReportDownload(response.data, 'Excel de Productos');
        return response.data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Error generating Excel report:', error);
      
      let errorMessage = 'Error generando reporte Excel';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      throw error;
    }
  },

  // Generar reporte de categorías PDF - CORREGIDO
  generateCategoriesPdfReport: async () => {
    try {
      console.log('📊 Generando reporte PDF de categorías...');
      
      const response = await api.get('/reports/categories/pdf/mobile', {
        timeout: 120000,
      });
      
      if (response.data && response.data.success) {
        await reportService.handleReportDownload(response.data, 'PDF de Categorías');
        return response.data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Error generating categories PDF report:', error);
      
      Alert.alert('Error', 'No se pudo generar el reporte de categorías');
      throw error;
    }
  },

  // Generar reporte de usuarios Excel - CORREGIDO
  generateUsersExcelReport: async () => {
    try {
      console.log('📊 Generando reporte Excel de usuarios...');
      
      const response = await api.get('/reports/users/excel/mobile', {
        timeout: 120000,
      });
      
      if (response.data && response.data.success) {
        await reportService.handleReportDownload(response.data, 'Excel de Usuarios');
        return response.data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Error generating users Excel report:', error);
      
      Alert.alert('Error', 'No se pudo generar el reporte de usuarios');
      throw error;
    }
  },

  // Generar reporte de inventario PDF - CORREGIDO
  generateInventoryReport: async () => {
    try {
      console.log('📊 Generando reporte PDF de inventario...');
      
      const response = await api.get('/reports/inventory/pdf/mobile', {
        timeout: 120000,
      });
      
      if (response.data && response.data.success) {
        await reportService.handleReportDownload(response.data, 'PDF de Inventario');
        return response.data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Error generating inventory PDF report:', error);
      
      Alert.alert('Error', 'No se pudo generar el reporte de inventario');
      throw error;
    }
  },

  // Determinar directorio de descarga según la plataforma - CORREGIDO
  getDownloadDirectory: async () => {
    try {
      // Usar documentDirectory que es accesible en ambas plataformas
      const downloadDir = FileSystem.documentDirectory + 'CatalogoRopa/Reportes/';
      
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
        console.log('📁 Directorio creado:', downloadDir);
      }
      
      return downloadDir;
    } catch (error) {
      console.error('❌ Error getting download directory:', error);
      return FileSystem.documentDirectory;
    }
  },

  // Guardar archivo en almacenamiento - CORREGIDO
  saveToStorage: async (fileName, base64Data) => {
    try {
      console.log('💾 Guardando archivo:', fileName);
      
      // Guardar en directorio de documentos de la app
      const downloadDir = await reportService.getDownloadDirectory();
      const fileUri = downloadDir + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('✅ Archivo guardado en:', fileUri);
      
      // Verificar que el archivo se guardó correctamente
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('El archivo no se guardó correctamente');
      }
      
      console.log('📄 Info del archivo:', {
        size: fileInfo.size,
        exists: fileInfo.exists,
        uri: fileInfo.uri,
      });
      
      // En Android, intentar también guardar en galería/downloads
      if (Platform.OS === 'android') {
        try {
          const hasPermission = await reportService.requestStoragePermissions();
          if (hasPermission) {
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            
            // Crear o encontrar álbum
            const albumName = 'Catálogo Ropa - Reportes';
            let album = await MediaLibrary.getAlbumAsync(albumName);
            
            if (!album) {
              album = await MediaLibrary.createAlbumAsync(albumName, asset);
              console.log('📱 Álbum creado:', albumName);
            } else {
              await MediaLibrary.addAssetsToAlbumAsync([asset], album);
              console.log('📱 Archivo agregado al álbum:', albumName);
            }
            
            return { internalUri: fileUri, publicUri: asset.uri };
          }
        } catch (publicError) {
          console.log('⚠️ No se pudo guardar en almacenamiento público:', publicError.message);
        }
      }
      
      return { internalUri: fileUri, publicUri: null };
      
    } catch (error) {
      console.error('❌ Error saving file:', error);
      throw error;
    }
  },

  // Manejar descarga y compartir archivo - CORREGIDO
  handleReportDownload: async (reportData, reportType = 'Reporte') => {
    try {
      const { fileName, base64Data, mimeType, size } = reportData;
      
      console.log('📥 Procesando descarga:', {
        fileName,
        size: `${(size / 1024).toFixed(1)} KB`,
        type: reportType,
      });
      
      // Validar datos
      if (!fileName || !base64Data) {
        throw new Error('Datos del reporte incompletos');
      }
      
      // Guardar archivo
      const savedFile = await reportService.saveToStorage(fileName, base64Data);
      
      // Verificar que se guardó
      const fileInfo = await FileSystem.getInfoAsync(savedFile.internalUri);
      if (!fileInfo.exists) {
        throw new Error('Error al guardar el archivo');
      }
      
      // Mostrar mensaje de éxito con opciones
      const isInPublicStorage = !!savedFile.publicUri;
      const locationMessage = isInPublicStorage 
        ? '📱 Guardado en: Galería > Catálogo Ropa - Reportes'
        : '📁 Guardado en la carpeta de documentos de la app';
      
      Alert.alert(
        `${reportType} Generado`,
        `✅ ${fileName}\n📊 Tamaño: ${(size / 1024).toFixed(1)} KB\n\n${locationMessage}`,
        [
          {
            text: 'Compartir',
            onPress: () => reportService.shareFile(savedFile.internalUri, fileName),
          },
          {
            text: 'Ver Ubicación',
            onPress: () => reportService.showFileLocation(savedFile.internalUri, isInPublicStorage),
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
      
    } catch (error) {
      console.error('❌ Error procesando descarga:', error);
      Alert.alert(
        'Error al Procesar Archivo',
        `❌ ${error.message || 'Error desconocido'}\n\nIntenta nuevamente o verifica tu almacenamiento disponible.`
      );
    }
  },

  // Compartir archivo usando el sistema - CORREGIDO
  shareFile: async (fileUri, fileName = 'reporte') => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) {
        console.log('📤 Compartiendo archivo:', fileName);
        
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/octet-stream',
          dialogTitle: `Compartir ${fileName}`,
          UTI: 'public.item', // Para iOS
        });
        
        console.log('✅ Archivo compartido exitosamente');
      } else {
        Alert.alert(
          'Compartir No Disponible',
          'La función de compartir no está disponible en este dispositivo.\n\nEl archivo está guardado en tu dispositivo.'
        );
      }
    } catch (error) {
      console.error('❌ Error sharing file:', error);
      Alert.alert(
        'Error al Compartir',
        'No se pudo compartir el archivo, pero está guardado en tu dispositivo.'
      );
    }
  },

  // Mostrar información de ubicación del archivo - CORREGIDO
  showFileLocation: (fileUri, isPublic = false) => {
    const message = isPublic 
      ? '📱 El archivo se guardó en la galería de tu teléfono.\n\n📁 Ubicación:\nGalería > Álbumes > "Catálogo Ropa - Reportes"\n\n💡 También aparecerá en tu aplicación de archivos en la sección de descargas.'
      : `📁 El archivo se guardó en:\n${fileUri}\n\n💡 Puedes encontrarlo en la carpeta de documentos de la aplicación.\n\nUsa el botón "Compartir" para enviarlo por WhatsApp, email, etc.`;
      
    Alert.alert(
      'Ubicación del Archivo',
      message,
      [{ text: 'Entendido', style: 'default' }]
    );
  },

  // Obtener reportes disponibles
  getAvailableReports: async () => {
    try {
      const response = await api.get('/reports/available');
      return response.data;
    } catch (error) {
      console.error('❌ Error getting available reports:', error);
      throw error;
    }
  },

  // Limpiar archivos antiguos - CORREGIDO
  cleanOldReports: async () => {
    try {
      console.log('🧹 Limpiando reportes antiguos...');
      const downloadDir = await reportService.getDownloadDirectory();
      
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      if (!dirInfo.exists) {
        return;
      }
      
      const files = await FileSystem.readDirectoryAsync(downloadDir);
      
      const reportFiles = files.filter(file => 
        file.endsWith('.pdf') || file.endsWith('.xlsx')
      );
      
      // Mantener solo los últimos 10 reportes
      if (reportFiles.length > 10) {
        const filesToDelete = reportFiles
          .slice(0, reportFiles.length - 10);
        
        for (const file of filesToDelete) {
          try {
            await FileSystem.deleteAsync(downloadDir + file);
            console.log('🗑️ Archivo eliminado:', file);
          } catch (error) {
            console.error('❌ Error eliminando archivo:', file, error);
          }
        }
        
        console.log(`🧹 Limpieza completada: ${filesToDelete.length} archivos eliminados`);
      }
      
    } catch (error) {
      console.error('❌ Error cleaning old reports:', error);
    }
  },

  // Obtener estadísticas de almacenamiento
  getStorageStats: async () => {
    try {
      const downloadDir = await reportService.getDownloadDirectory();
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      
      if (!dirInfo.exists) {
        return { totalFiles: 0, totalSize: 0 };
      }
      
      const files = await FileSystem.readDirectoryAsync(downloadDir);
      let totalSize = 0;
      
      for (const file of files) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(downloadDir + file);
          if (fileInfo.exists) {
            totalSize += fileInfo.size || 0;
          }
        } catch (error) {
          console.log('Error getting file info:', file);
        }
      }
      
      return {
        totalFiles: files.length,
        totalSize,
        totalSizeMB: totalSize / (1024 * 1024),
        directory: downloadDir,
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { totalFiles: 0, totalSize: 0 };
    }
  },
};