import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import CategoryCard from './CategoryCard';

export default function CategoryList({
  categories,
  onCategoryPress,
  refreshing = false,
  onRefresh,
  horizontal = false,
  showProductCount = false,
  emptyMessage = 'No hay categorías disponibles',
  contentContainerStyle,
  ...props
}) {
  const renderCategory = ({ item }) => (
    <CategoryCard
      category={item}
      onPress={() => onCategoryPress(item)}
      style={[
        styles.categoryCard,
        !horizontal && styles.verticalCard,
      ]}
      showProductCount={showProductCount}
      horizontal={horizontal}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="tag-multiple-outline" 
        size={64} 
        color={colors.textSecondary} 
      />
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id.toString()}
      horizontal={horizontal}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={[
        horizontal ? styles.horizontalList : styles.verticalList,
        categories.length === 0 && styles.emptyList,
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={!horizontal}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  verticalList: {
    padding: 8,
  },
  horizontalList: {
    paddingHorizontal: 8,
  },
  emptyList: {
    flex: 1,
  },
  categoryCard: {
    margin: 4,
  },
  verticalCard: {
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