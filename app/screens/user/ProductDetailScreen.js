import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { productService } from '../../services/productService';
import { colors } from '../../styles/theme';
import { formatPrice } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProductById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Sin stock', color: colors.error };
    if (stock <= 5) return { text: 'Pocas unidades', color: colors.warning };
    return { text: 'Disponible', color: colors.success };
  };

  if (loading) {
    return <Loading text="Cargando producto..." />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Header
          title="Producto"
          leftIcon="arrow-left"
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons 
            name="alert-circle-outline" 
            size={64} 
            color={colors.error} 
          />
          <Text style={styles.errorText}>Producto no encontrado</Text>
        </View>
      </View>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <View style={styles.container}>
      <Header
        title="Detalle del Producto"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {/* Product Image */}
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
                size={64}
                color={colors.textSecondary}
              />
            </View>
          )}
        </View>

        {/* Product Info */}
        <Card style={styles.infoCard}>
          <View style={styles.titleSection}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.categoryName}>{product.categoryName}</Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
              <Text style={styles.stockText}>{stockStatus.text}</Text>
            </View>
          </View>

          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Detalles</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Stock disponible:</Text>
              <Text style={styles.detailValue}>{product.stock} unidades</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categoría:</Text>
              <Text style={styles.detailValue}>{product.categoryName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estado:</Text>
              <Text style={[styles.detailValue, { color: product.active ? colors.success : colors.error }]}>
                {product.active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="Volver a Productos"
            variant="outline"
            onPress={() => navigation.navigate('Products')}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
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
  imageContainer: {
    height: width * 0.8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  infoCard: {
    marginBottom: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stockText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 12,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionsSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    marginBottom: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
  },
});