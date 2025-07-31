import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCategories } from '../../hooks/useCategories';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import CategoryList from '../../components/category/CategoryList';
import CategoryForm from '../../components/category/CategoryForm';
import Loading from '../../components/common/Loading';

const { width } = Dimensions.get('window');

export default function AdminCategoriesScreen({ navigation }) {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const resetForm = () => {
    setEditingCategory(null);
  };

  const handleCreateCategory = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (category) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de que quieres eliminar "${category.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la categoría');
            }
          },
        },
      ]
    );
  };

  const handleFormSubmit = async (categoryData) => {
    setFormLoading(true);
    try {
      console.log('Datos de categoría recibidos:', categoryData);
      
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, categoryData);
        console.log('Categoría actualizada:', result);
      } else {
        result = await createCategory(categoryData);
        console.log('Categoría creada:', result);
      }
      
      setShowModal(false);
      resetForm();
      return result; // Importante: retornar el resultado para el manejo de imágenes
      
    } catch (error) {
      console.error('Error en form submit:', error);
      Alert.alert(
        'Error',
        editingCategory
          ? 'No se pudo actualizar la categoría'
          : 'No se pudo crear la categoría'
      );
      throw error; // Re-lanzar el error para que CategoryForm lo maneje
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCategoryPress = (category) => {
    Alert.alert(
      category.name,
      'Selecciona una acción',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Editar',
          onPress: () => handleEditCategory(category),
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDeleteCategory(category),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gestionar Categorías"
        rightIcon="plus"
        onRightPress={handleCreateCategory}
      />

      <View style={styles.content}>
        {loading ? (
          <Loading text="Cargando categorías..." />
        ) : (
          <CategoryList
            categories={categories}
            onCategoryPress={handleCategoryPress}
            onRefresh={fetchCategories}
            showProductCount
            emptyMessage="No hay categorías. ¡Crea la primera!"
          />
        )}
      </View>

      {/* Modal con CategoryForm completo */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <Header
            title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            leftIcon="close"
            onLeftPress={() => setShowModal(false)}
          />
          
          <CategoryForm
            initialCategory={editingCategory}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
            isEdit={!!editingCategory}
          />
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={handleCreateCategory}>
        <MaterialCommunityIcons name="plus" size={24} color={colors.surface} />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});