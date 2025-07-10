import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import { formatPrice } from '../../utils/helpers';
import Card from '../common/Card';

export default function ProductCard({ product, onPress, style }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getStockColor = (stock) => {
    if (stock === 0) return colors.error;
    if (stock <= 5) return colors.warning;
    return colors.success;
  };

  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        {product.imageUrl && !imageError ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            onError={handleImageError}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons
              name="image-outline"
              size={40}
              color={colors.textSecondary}
            />
          </View>
        )}
        
        {/* Stock Badge */}
        <View style={[styles.stockBadge, { backgroundColor: getStockColor(product.stock) }]}>
          <Text style={styles.stockText}>{product.stock}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.categoryName} numberOfLines={1}>
          {product.categoryName}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {!product.active && (
            <View style={styles.inactiveLabel}>
              <Text style={styles.inactiveLabelText}>Inactivo</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    backgroundColor: colors.background,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  categoryName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  inactiveLabel: {
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactiveLabelText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
