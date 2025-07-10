import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import Card from '../common/Card';

export default function CategoryCard({ 
  category, 
  onPress, 
  style, 
  showProductCount = false,
  horizontal = false 
}) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const cardStyle = horizontal ? styles.horizontalCard : styles.verticalCard;

  return (
    <Card style={[cardStyle, style]} onPress={onPress}>
      <View style={horizontal ? styles.horizontalImageContainer : styles.verticalImageContainer}>
        {category.imageUrl && !imageError ? (
          <Image
            source={{ uri: category.imageUrl }}
            style={styles.categoryImage}
            onError={handleImageError}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={horizontal ? 32 : 48}
              color={colors.primary}
            />
          </View>
        )}
        
        {!category.active && (
          <View style={styles.inactiveOverlay}>
            <Text style={styles.inactiveText}>Inactiva</Text>
          </View>
        )}
      </View>

      <View style={horizontal ? styles.horizontalContent : styles.verticalContent}>
        <Text style={styles.categoryName} numberOfLines={horizontal ? 1 : 2}>
          {category.name}
        </Text>
        
        {category.description && (
          <Text style={styles.categoryDescription} numberOfLines={horizontal ? 1 : 3}>
            {category.description}
          </Text>
        )}
        
        {showProductCount && category.productCount !== undefined && (
          <View style={styles.productCountContainer}>
            <MaterialCommunityIcons
              name="package-variant"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.productCount}>
              {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  verticalCard: {
    padding: 0,
    overflow: 'hidden',
    minHeight: 200,
  },
  horizontalCard: {
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    width: 280,
    height: 120,
    marginHorizontal: 8,
  },
  verticalImageContainer: {
    height: 120,
    backgroundColor: colors.background,
    position: 'relative',
  },
  horizontalImageContainer: {
    width: 120,
    backgroundColor: colors.background,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary + '20',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 12,
  },
  verticalContent: {
    padding: 16,
    flex: 1,
  },
  horizontalContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  productCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  productCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
});
