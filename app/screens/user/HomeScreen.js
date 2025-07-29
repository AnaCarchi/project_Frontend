import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ProductCard from '../../components/product/ProductCard';
import CategoryCard from '../../components/category/CategoryCard';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);
      
      // Obtener productos destacados (primeros 6)
      setFeaturedProducts(productsData.slice(0, 6));
      setCategories(categoriesData.slice(0, 4)); // Primeras 4 categorías
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const renderStatCard = (title, value, icon, color) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <MaterialCommunityIcons name={icon} size={32} color={color} />
      </View>
    </Card>
  );

  if (loading) {
    return <Loading text="Cargando inicio..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Inicio"
        subtitle={`Bienvenido, ${user?.username}`}
        rightIcon="logout"
        onRightPress={handleLogout}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Productos', featuredProducts.length, 'package-variant', colors.primary)}
            {renderStatCard('Categorías', categories.length, 'tag-multiple', colors.accent)}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => navigation.navigate('Products', { categoryId: item.id })}
                horizontal
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Featured Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos Destacados</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                style={styles.productCard}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Products')}
            >
              <MaterialCommunityIcons name="shopping" size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Ver Productos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Categories')}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={24} color={colors.accent} />
              <Text style={styles.quickActionText}>Categorías</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Profile')}
            >
              <MaterialCommunityIcons name="account" size={24} color={colors.success} />
              <Text style={styles.quickActionText}>Mi Perfil</Text>
            </TouchableOpacity>
          </View>
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
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderLeftWidth: 4,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  horizontalList: {
    paddingHorizontal: 4,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    flex: 1,
    minWidth: '47%',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
});