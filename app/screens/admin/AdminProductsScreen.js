import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import ProductList from '../../components/product/ProductList';
import ProductForm from '../../components/product/ProductForm';
import Loading from '../../components/common/Loading';

const { width } = Dimensions.get('window');

export default function AdminProductsScreen({ navigation }) {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  } = useProducts();
  
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const handleFormSubmit = async (productData) => {
    setFormLoading(true);
    try {
      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData);
      } else {
        result = await createProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
      return result; // Importante: retornar el resultado para el manejo de imágenes
    } catch (error) {
      Alert.alert(
        'Error',
        editingProduct
          ? 'No se pudo actualizar el producto'
          : 'No se pudo crear el producto'
      );
      throw error; // Re-lanzar el error para que ProductForm lo maneje
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleProductPress = (product) => {
    Alert.alert(
      product.name,
      'Selecciona una acción',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Editar',
          onPress: () => handleEditProduct(product),
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDeleteProduct(product),
        },
      ]
    );
  };

  // Mostrar loading si están cargando las categorías
  if (categoriesLoading) {
    return <Loading text="Cargando datos..." />;
  }

  if (showForm) {
    return (
      <View style={styles.container}>
        <Header
          title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          leftIcon="arrow-left"
          onLeftPress={handleFormCancel}
        />
        <ProductForm
          initialProduct={editingProduct}
          categories={categories} // Pasar las categorías
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
          isEdit={!!editingProduct}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Gestionar Productos"
        rightIcon="plus"
        onRightPress={handleCreateProduct}
      />

      <View style={styles.content}>
        {loading ? (
          <Loading text="Cargando productos..." />
        ) : (
          <ProductList
            products={products}
            onProductPress={handleProductPress}
            onRefresh={fetchProducts}
            emptyMessage="No hay productos. ¡Crea el primero!"
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleCreateProduct}>
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
    bottom: width * 0.06, // 6% del ancho
    right: width * 0.06, // 6% del ancho
    width: Math.max(width * 0.14, 56), // Mínimo 56px
    height: Math.max(width * 0.14, 56), // Mínimo 56px
    borderRadius: Math.max(width * 0.07, 28), // Mínimo 28px
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});