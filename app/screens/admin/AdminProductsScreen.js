import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../../hooks/useProducts';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import ProductList from '../../components/product/ProductList';
import ProductForm from '../../components/product/ProductForm';
import Loading from '../../components/common/Loading';

export default function AdminProductsScreen({ navigation }) {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

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
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      Alert.alert(
        'Error',
        editingProduct
          ? 'No se pudo actualizar el producto'
          : 'No se pudo crear el producto'
      );
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
