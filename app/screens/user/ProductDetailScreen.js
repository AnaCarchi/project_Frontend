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
