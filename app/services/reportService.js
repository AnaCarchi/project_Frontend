import api from './api';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const reportService = {
  // Generar reporte de productos PDF
  generateProductsPdfReport: async () => {
    try {
      console.log('📄 Generando reporte PDF de productos...');
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
      console.log('📊 Generando reporte Excel de productos...');
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
      console.log('📄 Generando reporte PDF de categorías...');
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
      console.log('📊 Generando reporte Excel de usuarios...');
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
      console.log('📄 Generando reporte PDF de inventario...');
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

  // Manejar descarga y compartir archivo
  handleReportDownload: async (reportData) => {
    try {
      const { fileName, base64Data, mimeType, size } = reportData;
      
      console.log('💾 Procesando descarga de archivo:', fileName);
      console.log('📊 Tamaño del archivo:', size, 'bytes');
      
      // Crear ruta temporal para el archivo
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Escribir archivo desde base64
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('✅ Archivo guardado en:', fileUri);
      
      // Verificar que el archivo se guardó correctamente
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log('📄 Info del archivo guardado:', fileInfo);
      
      if (fileInfo.exists) {
        // Mostrar opciones al usuario
        Alert.alert(
          'Reporte Generado',
          `${fileName}\nTamaño: ${(size / 1024).toFixed(1)} KB`,
          [
            {
              text: 'Compartir',
              onPress: () => reportService.shareFile(fileUri),
            },
            {
              text: 'Ver Ubicación',
              onPress: () => reportService.showFileLocation(fileUri),
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
      console.error('❌ Error procesando descarga:', error);
      Alert.alert('Error', 'No se pudo procesar el archivo: ' + error.message);
    }
  },

  // Compartir archivo usando el sistema
  shareFile: async (fileUri) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) {
        console.log('📤 Compartiendo archivo:', fileUri);
        await Sharing.shareAsync(fileUri);
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
  showFileLocation: (fileUri) => {
    Alert.alert(
      'Archivo Guardado',
      `El archivo se guardó en:\n${fileUri}\n\nPuedes encontrarlo en la carpeta de documentos de la aplicación.`,
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
};