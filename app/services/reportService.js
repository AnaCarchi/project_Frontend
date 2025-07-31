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

  // Generar reporte de productos PDF
  generateProductsPdfReport: async () => {
    try {
      console.log('Generando reporte PDF de productos...');
      const response = await api.get('/reports/products/pdf/mobile');
      
      if (response.data.success) {
        await reportService.handleReportDownload(response.data);
        return response.data;
      } else {
        throw new Error('Error generando reporte');
      }
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw error;
    }
  },

  // Generar reporte de productos Excel
  generateProductsExcelReport: async () => {
    try {
      console.log('Generando reporte Excel de productos...');
      const response = await api.get('/reports/products/excel/mobile');
      
      if (response.data.success) {
        await reportService.handleReportDownload(response.data);
        return response.data;
      } else {
        throw new Error('Error generando reporte');
      }
    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw error;
    }
  },

  // Generar reporte de categorías PDF
  generateCategoriesPdfReport: async () => {
    try {
      console.log('Generando reporte PDF de categorías...');
      const response = await api.get('/reports/categories/pdf/mobile');
      
      if (response.data.success) {
        await reportService.handleReportDownload(response.data);
        return response.data;
      } else {
        throw new Error('Error generando reporte');
      }
    } catch (error) {
      console.error('Error generating categories PDF report:', error);
      throw error;
    }
  },

  // Generar reporte de usuarios Excel
  generateUsersExcelReport: async () => {
    try {
      console.log('Generando reporte Excel de usuarios...');
      const response = await api.get('/reports/users/excel/mobile');
      
      if (response.data.success) {
        await reportService.handleReportDownload(response.data);
        return response.data;
      } else {
        throw new Error('Error generando reporte');
      }
    } catch (error) {
      console.error('Error generating users Excel report:', error);
      throw error;
    }
  },

  // Generar reporte de inventario PDF
  generateInventoryReport: async () => {
    try {
      console.log('Generando reporte PDF de inventario...');
      const response = await api.get('/reports/inventory/pdf/mobile');
      
      if (response.data.success) {
        await reportService.handleReportDownload(response.data);
        return response.data;
      } else {
        throw new Error('Error generando reporte');
      }
    } catch (error) {
      console.error('Error generating inventory PDF report:', error);
      throw error;
    }
  },

  // Determinar directorio de descarga según la plataforma
  getDownloadDirectory: async () => {
    try {
      if (Platform.OS === 'android') {
        const downloadDir = FileSystem.documentDirectory + 'Download/';
        
        const dirInfo = await FileSystem.getInfoAsync(downloadDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
        }
        
        return downloadDir;
      } else {
        return FileSystem.documentDirectory;
      }
    } catch (error) {
      console.error('Error getting download directory:', error);
      return FileSystem.documentDirectory;
    }
  },

  // Guardar archivo en almacenamiento
  saveToPublicStorage: async (fileName, base64Data) => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await reportService.requestStoragePermissions();
        if (!hasPermission) {
          throw new Error('Permisos de almacenamiento denegados');
        }

        const tempUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(tempUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(tempUri);
        
        const albumName = 'Catálogo Ropa - Reportes';
        let album = await MediaLibrary.getAlbumAsync(albumName);
        
        if (!album) {
          album = await MediaLibrary.createAlbumAsync(albumName, asset);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album);
        }

        console.log('Archivo guardado en almacenamiento público:', asset.uri);
        return asset.uri;
        
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return fileUri;
      }
    } catch (error) {
      console.error('Error saving to public storage:', error);
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return fileUri;
    }
  },

  // Manejar descarga y compartir archivo
  handleReportDownload: async (reportData) => {
    try {
      const { fileName, base64Data, mimeType, size } = reportData;
      
      console.log('Procesando descarga de archivo:', fileName);
      console.log('Tamaño del archivo:', size, 'bytes');
      
      let finalUri;
      try {
        finalUri = await reportService.saveToPublicStorage(fileName, base64Data);
        console.log('Archivo guardado exitosamente en:', finalUri);
      } catch (error) {
        console.error('Error guardando en almacenamiento público:', error);
        
        const downloadDir = await reportService.getDownloadDirectory();
        finalUri = downloadDir + fileName;
        await FileSystem.writeAsStringAsync(finalUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('Archivo guardado en directorio interno:', finalUri);
      }
      
      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      console.log('Info del archivo guardado:', fileInfo);
      
      if (fileInfo.exists) {
        const isPublic = Platform.OS === 'android' && finalUri.includes('MediaLibrary');
        const locationMessage = isPublic 
          ? 'Guardado en: Galería > Catálogo Ropa - Reportes'
          : `Guardado en el directorio de la app`;
          
        Alert.alert(
          'Reporte Generado Exitosamente',
          `${fileName}\nTamaño: ${(size / 1024).toFixed(1)} KB\n\n${locationMessage}`,
          [
            {
              text: 'Compartir',
              onPress: () => reportService.shareFile(finalUri),
            },
            {
              text: 'Ver Ubicación',
              onPress: () => reportService.showFileLocation(finalUri, isPublic),
            },
            {
              text: 'OK',
              style: 'default',
            },
          ]
        );
      } else {
        throw new Error('El archivo no se guardó correctamente');
      }
      
    } catch (error) {
      console.error('Error procesando descarga:', error);
      Alert.alert('Error', 'No se pudo procesar el archivo: ' + error.message);
    }
  },

  // Compartir archivo usando el sistema
  shareFile: async (fileUri) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) {
        console.log('Compartiendo archivo:', fileUri);
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/octet-stream',
          dialogTitle: 'Compartir reporte',
        });
      } else {
        Alert.alert(
          'Compartir no disponible',
          'La función de compartir no está disponible en este dispositivo'
        );
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      Alert.alert('Error', 'No se pudo compartir el archivo');
    }
  },

  // Mostrar información de ubicación del archivo
  showFileLocation: (fileUri, isPublic = false) => {
    const message = isPublic 
      ? 'El archivo se guardó en la galería de tu teléfono.\n\nPuedes encontrarlo en:\nGalería > Álbumes > "Catálogo Ropa - Reportes"\n\nTambién aparecerá en la sección de descargas.'
      : `El archivo se guardó en:\n${fileUri}\n\nPuedes encontrarlo en la carpeta de documentos de la aplicación.`;
      
    Alert.alert(
      'Ubicación del Archivo',
      message,
      [{ text: 'OK' }]
    );
  },

  // Obtener reportes disponibles
  getAvailableReports: async () => {
    try {
      const response = await api.get('/reports/available');
      return response.data;
    } catch (error) {
      console.error('Error getting available reports:', error);
      throw error;
    }
  },

  // Limpiar archivos antiguos
  cleanOldReports: async () => {
    try {
      console.log('Limpiando reportes antiguos...');
      const downloadDir = await reportService.getDownloadDirectory();
      const files = await FileSystem.readDirectoryAsync(downloadDir);
      
      const reportFiles = files.filter(file => 
        file.endsWith('.pdf') || file.endsWith('.xlsx')
      );
      
      if (reportFiles.length > 10) {
        const filesToDelete = reportFiles.slice(0, reportFiles.length - 10);
        
        for (const file of filesToDelete) {
          try {
            await FileSystem.deleteAsync(downloadDir + file);
            console.log('Archivo eliminado:', file);
          } catch (error) {
            console.error('Error eliminando archivo:', file, error);
          }
        }
      }
      
    } catch (error) {
      console.error('Error cleaning old reports:', error);
    }
  },
};