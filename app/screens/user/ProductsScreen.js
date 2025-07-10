import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';
import ProductCard from '../../components/product/ProductCard';
import { debounce } from '../../utils/helpers';

export default function ProductsScreen({ navigation, route }) {
  const { categoryId } = route.params || {};
  const { products, loading, searchProducts, getProductsByCategory, fetchProducts } = useProducts();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (categoryId) {
      getProductsByCategory(categoryId);
      setSelectedCategory(categoryId);
    } else {
      fetchProducts();
    }
  }, [categoryId]);

  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      searchProducts(query);
    } else {
      fetchProducts();
    }
  }, 500);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setSelectedCategory(null);
    debouncedSearch(text);
  };

  const handleCategoryFilter = (catId) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
      setSearchQuery('');
      fetchProducts();
    } else {
      setSelectedCategory(catId);
      setSearchQuery('');
      getProductsByCategory(catId);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedCategory) {
      await getProductsByCategory(selectedCategory);
    } else if (searchQuery) {
      await searchProducts(searchQuery);
    } else {
      await fetchProducts();
    }
    setRefreshing(false);
  };

  const renderCategoryFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        selectedCategory === item.id && styles.categoryFilterActive
      ]}
      onPress={() => handleCategoryFilter(item.id)}
    >
      <Text style={[
        styles.categoryFilterText,
        selectedCategory === item.id && styles.categoryFilterTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      style={styles.productCard}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        title="Productos"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filters */}
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilters}
          style={styles.categoryFiltersContainer}
        />

        {/* Products List */}
        {loading ? (
          <Loading text="Cargando productos..." />
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.productsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons 
                  name="package-variant-closed" 
                  size={64} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.emptyText}>No se encontraron productos</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
