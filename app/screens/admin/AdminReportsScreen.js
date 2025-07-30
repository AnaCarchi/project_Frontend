import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import { reportService } from '../../services/reportService';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

const { width } = Dimensions.get('window');

export default function AdminReportsScreen({ navigation }) {
  const [generating, setGenerating] = useState(null);

  const reportTypes = [
    {
      id: 'products',
      title: 'Reporte de Productos',
      description: 'Lista completa de productos con detalles',
      icon: 'package-variant',
      color: colors.primary,
      formats: [
        { type: 'PDF', service: 'generateProductsPdfReport' },
        { type: 'Excel', service: 'generateProductsExcelReport' }
      ],
    },
    {
      id: 'categories',
      title: 'Reporte de Categorías',
      description: 'Información de todas las categorías',
      icon: 'tag-multiple',
      color: colors.accent,
      formats: [
        { type: 'PDF', service: 'generateCategoriesPdfReport' }
      ],
    },
    {
      id: 'users',
      title: 'Reporte de Usuarios',
      description: 'Lista de usuarios registrados',
      icon: 'account-group',
      color: colors.success,
      formats: [
        { type: 'Excel', service: 'generateUsersExcelReport' }
      ],
    },
    {
      id: 'inventory',
      title: 'Reporte de Inventario',
      description: 'Estado actual del inventario',
      icon: 'warehouse',
      color: colors.warning,
      formats: [
        { type: 'PDF', service: 'generateInventoryReport' }
      ],
    },
  ];

  const handleGenerateReport = async (reportType, format) => {
    const generatingKey = `${reportType.id}_${format.type}`;
    
    Alert.alert(
      'Generar Reporte',
      `¿Generar ${reportType.title} en formato ${format.type}?\n\nEl archivo se guardará en tu dispositivo y podrás compartirlo.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Generar',
          onPress: async () => {
            setGenerating(generatingKey);
            
            try {
              console.log(`📊 Generando reporte: ${reportType.title} - ${format.type}`);
              
              // Llamar al servicio correspondiente
              await reportService[format.service]();
              
              console.log('✅ Reporte generado exitosamente');
              
            } catch (error) {
              console.error('❌ Error generando reporte:', error);
              
              let errorMessage = 'Error generando el reporte';
              if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
              } else if (error.message) {
                errorMessage = error.message;
              }
              
              Alert.alert(
                'Error',
                errorMessage,
                [{ text: 'OK' }]
              );
            } finally {
              setGenerating(null);
            }
          },
        },
      ]
    );
  };

  const ReportCard = ({ report }) => (
    <Card style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
          <MaterialCommunityIcons
            name={report.icon}
            size={32}
            color={report.color}
          />
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportDescription}>{report.description}</Text>
        </View>
      </View>

      <View style={styles.reportActions}>
        {report.formats.map((format) => {
          const generatingKey = `${report.id}_${format.type}`;
          const isGenerating = generating === generatingKey;
          
          return (
            <TouchableOpacity
              key={format.type}
              style={[
                styles.formatButton,
                isGenerating && styles.formatButtonGenerating,
              ]}
              onPress={() => handleGenerateReport(report, format)}
              disabled={isGenerating || generating !== null}
            >
              {isGenerating ? (
                <>
                  <MaterialCommunityIcons
                    name="loading"
                    size={16}
                    color={colors.surface}
                  />
                  <Text style={styles.formatButtonText}>Generando...</Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name={format.type === 'PDF' ? 'file-pdf-box' : 'file-excel-box'}
                    size={16}
                    color={colors.surface}
                  />
                  <Text style={styles.formatButtonText}>{format.type}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Reportes"
        subtitle="Generar y descargar reportes"
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reportes Disponibles</Text>
          <Text style={styles.sectionDescription}>
            Los reportes se guardarán en tu dispositivo y podrás compartirlos
          </Text>
        </View>

        <View style={styles.reportsContainer}>
          {reportTypes.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </View>

        <View style={styles.section}>
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.infoTitle}>Información</Text>
            </View>
            <Text style={styles.infoText}>
              • Los reportes se generan con datos actualizados{'\n'}
              • Se guardan en la carpeta de documentos de la app{'\n'}
              • Puedes compartirlos por email, WhatsApp, etc.{'\n'}
              • Los archivos PDF se pueden abrir en cualquier visor{'\n'}
              • Los archivos Excel se pueden abrir en apps de hojas de cálculo
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reportsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  reportCard: {
    padding: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  formatButtonGenerating: {
    backgroundColor: colors.textSecondary,
  },
  formatButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    margin: 0,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});