import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCategories } from '../../hooks/useCategories';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';
import CategoryCard from '../../components/category/CategoryCard';

export default function CategoriesScreen({ navigation }) {
  const { categories, loading, fetchCategories } = useCategories();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const renderCategory = ({ item }) => (
    <CategoryCard
      category={item}
      onPress={() => navigation.navigate('Products', { categoryId: item.id })}
      style={styles.categoryCard}
      showProductCount
    />
  );

  if (loading) {
    return <Loading text="Cargando categorías..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Categorías"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.categoriesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="tag-multiple-outline" 
                size={64} 
                color={colors.textSecondary} 
              />
              <Text style={styles.emptyText}>No hay categorías disponibles</Text>
            </View>
          }
        />
      </View>
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
    padding: 16,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryCard: {
    marginBottom: 12,
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