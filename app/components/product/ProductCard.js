import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import { formatPrice } from '../../utils/helpers';
import Card from '../common/Card';

const { width, height } = Dimensions.get('window');

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
              size={Math.min(width * 0.1, 40)} // Responsive icon size
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
    minWidth: Math.min(width * 0.4, 160), // Mínimo 40% del ancho o 160px
  },
  imageContainer: {
    height: Math.min(width * 0.4, 160), // Altura responsive basada en el ancho
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
    top: width * 0.02, // 2% del ancho
    right: width * 0.02, // 2% del ancho
    width: Math.max(width * 0.06, 24), // Mínimo 24px
    height: Math.max(width * 0.06, 24), // Mínimo 24px
    borderRadius: Math.max(width * 0.03, 12), // Mínimo 12px
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockText: {
    color: colors.surface,
    fontSize: Math.min(width * 0.025, 10), // Responsive font size
    fontWeight: 'bold',
  },
  content: {
    padding: width * 0.03, // 3% del ancho
  },
  productName: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '600',
    color: colors.text,
    marginBottom: height * 0.005, // 0.5% del alto
    lineHeight: Math.min(width * 0.05, 20), // Responsive line height
  },
  categoryName: {
    fontSize: Math.min(width * 0.03, 12), // Responsive font size
    color: colors.textSecondary,
    marginBottom: height * 0.01, // 1% del alto
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: Math.min(width * 0.045, 18), // Responsive font size
    fontWeight: 'bold',
    color: colors.primary,
  },
  inactiveLabel: {
    backgroundColor: colors.error,
    paddingHorizontal: width * 0.015, // 1.5% del ancho
    paddingVertical: height * 0.002, // 0.2% del alto
    borderRadius: Math.min(width * 0.01, 4), // Responsive border radius
  },
  inactiveLabelText: {
    color: colors.surface,
    fontSize: Math.min(width * 0.025, 10), // Responsive font size
    fontWeight: 'bold',
  },
});