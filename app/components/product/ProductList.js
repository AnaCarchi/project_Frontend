import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import ProductCard from './ProductCard';

export default function ProductList({
  products,
  onProductPress,
  refreshing = false,
  onRefresh,
  numColumns = 2,
  emptyMessage = 'No hay productos disponibles',
  contentContainerStyle,
  ...props
}) {
  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => onProductPress(item)}
      style={[
        styles.productCard,
        numColumns === 2 && styles.halfWidth,
      ]}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="package-variant-closed" 
        size={64} 
        color={colors.textSecondary} 
      />
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={[
        styles.list,
        products.length === 0 && styles.emptyList,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  emptyList: {
    flex: 1,
  },
  productCard: {
    margin: 4,
  },
  halfWidth: {
    flex: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
