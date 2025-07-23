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
      formats: ['PDF', 'Excel'],
    },
    {
      id: 'categories',
      title: 'Reporte de Categorías',
      description: 'Información de todas las categorías',
      icon: 'tag-multiple',
      color: colors.accent,
      formats: ['PDF'],
    },
    {
      id: 'users',
      title: 'Reporte de Usuarios',
      description: 'Lista de usuarios registrados',
      icon: 'account-group',
      color: colors.success,
      formats: ['Excel'],
    },
    {
      id: 'inventory',
      title: 'Reporte de Inventario',
      description: 'Estado actual del inventario',
      icon: 'warehouse',
      color: colors.warning,
      formats: ['PDF'],
    },
  ];

  const handleGenerateReport = (reportType, format) => {
    Alert.alert(
      'Generar Reporte',
      `¿Generar ${reportType.title} en formato ${format}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Generar',
          onPress: async () => {
            setGenerating(`${reportType.id}_${format}`);
            
            // Simular generación de reporte
            setTimeout(() => {
              setGenerating(null);
              Alert.alert(
                'Reporte Generado',
                `El ${reportType.title} ha sido generado exitosamente.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Aquí implementarías la descarga del reporte
                      console.log(`Downloading ${reportType.id} report in ${format} format`);
                    },
                  },
                ]
              );
            }, 2000);
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
          const isGenerating = generating === `${report.id}_${format}`;
          return (
            <TouchableOpacity
              key={format}
              style={[
                styles.formatButton,
                isGenerating && styles.formatButtonGenerating,
              ]}
              onPress={() => handleGenerateReport(report, format)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <MaterialCommunityIcons
                  name="loading"
                  size={16}
                  color={colors.surface}
                />
              ) : (
                <MaterialCommunityIcons
                  name={format === 'PDF' ? 'file-pdf-box' : 'file-excel-box'}
                  size={16}
                  color={colors.surface}
                />
              )}
              <Text style={styles.formatButtonText}>
                {isGenerating ? 'Generando...' : format}
              </Text>
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
        subtitle="Generar reportes del sistema"
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reportes Disponibles</Text>
          <Text style={styles.sectionDescription}>
            Selecciona el tipo de reporte que deseas generar
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
              Los reportes se generan con la información más actualizada del sistema. 
              El tiempo de generación puede variar según la cantidad de datos.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
