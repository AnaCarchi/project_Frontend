import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { colors } from '../../styles/theme';
import { validation } from '../../utils/validation';
import { imageService } from '../../services/imageService';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import ImagePickerComponent from '../common/ImagePicker';

const { width, height } = Dimensions.get('window');

export default function CategoryForm({
  initialCategory = null, 
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) {
  // Inicialización del estado
  const [formData, setFormData] = useState({
    name: initialCategory?.name || '',
    description: initialCategory?.description || '',
    active: initialCategory?.active !== undefined ? initialCategory.active : true,
    imageUrl: initialCategory?.imageUrl || null,
  });
  
  const [errors, setErrors] = useState({});
  const [selectedImageUri, setSelectedImageUri] = useState(initialCategory?.imageUrl || null);
  const [imageChanged, setImageChanged] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageSelected = (imageUri) => {
    setSelectedImageUri(imageUri);
    setImageChanged(true);
    updateFormData('imageUrl', imageUri);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validation.required(formData.name)) {
      newErrors.name = 'El nombre es requerido';
    } else if (!validation.minLength(formData.name, 2)) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (!validation.maxLength(formData.name, 100)) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (formData.description && !validation.maxLength(formData.description, 500)) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        active: formData.active,
      };

      console.log('Enviando datos de categoría:', categoryData);

      // Llamar a onSubmit
      const result = await onSubmit(categoryData);
      
      // Si hay una nueva imagen y la categoría se creó/actualizó exitosamente
      if (imageChanged && selectedImageUri && result && result.id) {
        try {
          await imageService.uploadCategoryImage(result.id, selectedImageUri);
          Alert.alert('Éxito', 'Categoría e imagen guardadas correctamente');
        } catch (imageError) {
          console.error('Error uploading category image:', imageError);
          Alert.alert(
            'Categoría guardada', 
            'La categoría se guardó correctamente, pero hubo un error al subir la imagen. Puedes intentar subirla más tarde.'
          );
        }
      }
    } catch (error) {
      console.error('Error in category form submission:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.formCard}>
        <Text style={styles.title}>
          {isEdit ? 'Editar Categoría' : 'Nueva Categoría'}
        </Text>

        {/* Selector de imagen */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionLabel}>Imagen de la categoría</Text>
          <ImagePickerComponent
            imageUri={selectedImageUri}
            onImageSelected={handleImageSelected}
            placeholder="Seleccionar imagen de la categoría"
            disabled={loading}
          />
        </View>

        <Input
          label="Nombre de la categoría *"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          error={errors.name}
          placeholder="Ingresa el nombre de la categoría"
          leftIcon="tag"
        />

        <Input
          label="Descripción"
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          error={errors.description}
          placeholder="Descripción de la categoría (opcional)"
          multiline
          numberOfLines={3}
          leftIcon="text"
        />

        {/* Botón de prueba de conexión - solo en desarrollo */}
        {__DEV__ && (
          <View style={styles.testSection}>
            <Text style={styles.sectionLabel}>Pruebas de Conexión</Text>
            <View style={styles.testButtons}>
              <Button
                title="Test API"
                variant="outline"
                size="small"
                onPress={async () => {
                  try {
                    const result = await imageService.testConnection();
                    Alert.alert(
                      result.success ? 'Conexión OK' : 'Error',
                      result.message
                    );
                  } catch (error) {
                    Alert.alert('Error', error.message);
                  }
                }}
                style={styles.testButton}
              />
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="Cancelar"
            variant="outline"
            onPress={onCancel}
            style={styles.actionButton}
            disabled={loading}
          />
          
          <Button
            title={isEdit ? 'Actualizar' : 'Crear'}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.actionButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formCard: {
    margin: width * 0.04,
  },
  title: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  imageSection: {
    marginBottom: height * 0.025,
  },
  sectionLabel: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: colors.text,
    marginBottom: height * 0.01,
  },
  testSection: {
    marginBottom: height * 0.02,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  testButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  testButton: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: width * 0.03,
    marginTop: height * 0.03,
  },
  actionButton: {
    flex: 1,
  },
});