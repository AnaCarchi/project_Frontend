import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '../../styles/theme';
import { validation } from '../../utils/validation';
import { imageService } from '../../services/imageService';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import ImagePickerComponent from '../common/ImagePicker';

export default function ProductForm({
  initialProduct = {},
  categories = [],
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    name: initialProduct.name || '',
    description: initialProduct.description || '',
    price: initialProduct.price?.toString() || '',
    stock: initialProduct.stock?.toString() || '',
    categoryId: initialProduct.categoryId?.toString() || '',
    active: initialProduct.active !== undefined ? initialProduct.active : true,
    imageUrl: initialProduct.imageUrl || null,
  });
  const [errors, setErrors] = useState({});
  const [selectedImageUri, setSelectedImageUri] = useState(initialProduct.imageUrl || null);
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
    }

    if (!validation.required(formData.price)) {
      newErrors.price = 'El precio es requerido';
    } else if (!validation.price(formData.price)) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }

    if (!validation.required(formData.stock)) {
      newErrors.stock = 'El stock es requerido';
    } else if (!validation.stock(formData.stock)) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!validation.required(formData.categoryId)) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    if (formData.description && !validation.maxLength(formData.description, 1000)) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
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
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        active: formData.active,
      };

      // Primero crear/actualizar el producto
      const result = await onSubmit(productData);
      
      // Si hay una nueva imagen y el producto se creó/actualizó exitosamente
      if (imageChanged && selectedImageUri && result && result.id) {
        try {
          await imageService.uploadProductImage(result.id, selectedImageUri);
          Alert.alert('Éxito', 'Producto e imagen guardados correctamente');
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          Alert.alert(
            'Producto guardado', 
            'El producto se guardó correctamente, pero hubo un error al subir la imagen. Puedes intentar subirla más tarde.'
          );
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <Text style={styles.title}>
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </Text>

        {/* Selector de imagen */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionLabel}>Imagen del producto</Text>
          <ImagePickerComponent
            imageUri={selectedImageUri}
            onImageSelected={handleImageSelected}
            placeholder="Seleccionar imagen del producto"
            disabled={loading}
          />
        </View>

        <Input
          label="Nombre del producto *"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          error={errors.name}
          placeholder="Ingresa el nombre del producto"
          leftIcon="package-variant"
        />

        <Input
          label="Descripción"
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          error={errors.description}
          placeholder="Descripción del producto (opcional)"
          multiline
          numberOfLines={3}
          leftIcon="text"
        />

        <View style={styles.row}>
          <Input
            label="Precio *"
            value={formData.price}
            onChangeText={(text) => updateFormData('price', text)}
            error={errors.price}
            placeholder="0.00"
            keyboardType="numeric"
            leftIcon="currency-usd"
            style={styles.halfInput}
          />

          <Input
            label="Stock *"
            value={formData.stock}
            onChangeText={(text) => updateFormData('stock', text)}
            error={errors.stock}
            placeholder="0"
            keyboardType="numeric"
            leftIcon="package"
            style={styles.halfInput}
          />
        </View>

        {/* Category Selector - Simplificado para el ejemplo */}
        <Input
          label="ID de Categoría *"
          value={formData.categoryId}
          onChangeText={(text) => updateFormData('categoryId', text)}
          error={errors.categoryId}
          placeholder="ID de la categoría"
          keyboardType="numeric"
          leftIcon="tag"
        />

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
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  imageSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
});