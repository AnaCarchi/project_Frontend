import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCategories } from '../../hooks/useCategories';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import CategoryList from '../../components/category/CategoryList';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  const handleCreateCategory = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
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

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre de la categoría es requerido');
      return;
    }

    setFormLoading(true);
    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      Alert.alert(
        'Error',
        editingCategory
          ? 'No se pudo actualizar la categoría'
          : 'No se pudo crear la categoría'
      );
    } finally {
      setFormLoading(false);
    }
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

      {/* Modal para crear/editar categoría */}
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
          
          <ScrollView style={styles.modalContent}>
            <Card style={styles.formCard}>
              <Input
                label="Nombre de la categoría *"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Ingresa el nombre de la categoría"
                leftIcon="tag"
              />

              <Input
                label="Descripción"
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Descripción de la categoría (opcional)"
                multiline
                numberOfLines={3}
                leftIcon="text"
              />

              <View style={styles.formActions}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={() => setShowModal(false)}
                  style={styles.formButton}
                  disabled={formLoading}
                />
                
                <Button
                  title={editingCategory ? 'Actualizar' : 'Crear'}
                  onPress={handleFormSubmit}
                  loading={formLoading}
                  disabled={formLoading}
                  style={styles.formButton}
                />
              </View>
            </Card>
          </ScrollView>
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: (width - 64) / 2,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  linksCard: {
    padding: 0,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  linkDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
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
  modalContent: {
    flex: 1,
  },
  formCard: {
    margin: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  formButton: {
    flex: 1,
  },
});