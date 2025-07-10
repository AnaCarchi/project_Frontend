import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { userService } from '../../services/userService';
import { colors } from '../../styles/theme';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [products, categories, users] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        userService.getAllUsers(),
      ]);

      const lowStock = products.filter(p => p.stock <= 5).length;

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalUsers: users.length,
        lowStockProducts: lowStock,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <MaterialCommunityIcons name={icon} size={36} color={color} />
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading text="Cargando panel de administración..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Panel de Administración"
        subtitle={`Bienvenido, ${user?.username}`}
        rightIcon="logout"
        onRightPress={logout}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Estadísticas principales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Productos"
              value={stats.totalProducts}
              icon="package-variant"
              color={colors.primary}
              onPress={() => navigation.navigate('Products')}
            />
            <StatCard
              title="Categorías"
              value={stats.totalCategories}
              icon="tag-multiple"
              color={colors.accent}
              onPress={() => navigation.navigate('Categories')}
            />
            <StatCard
              title="Usuarios"
              value={stats.totalUsers}
              icon="account-group"
              color={colors.success}
              onPress={() => navigation.navigate('Users')}
            />
            <StatCard
              title="Stock Bajo"
              value={stats.lowStockProducts}
              icon="alert-circle"
              color={colors.warning}
              onPress={() => navigation.navigate('Products')}
            />
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Nuevo Producto"
              icon="plus-box"
              color={colors.primary}
              onPress={() => navigation.navigate('Products')}
            />
            <QuickAction
              title="Nueva Categoría"
              icon="tag-plus"
              color={colors.accent}
              onPress={() => navigation.navigate('Categories')}
            />
            <QuickAction
              title="Ver Usuarios"
              icon="account-multiple"
              color={colors.success}
              onPress={() => navigation.navigate('Users')}
            />
            <QuickAction
              title="Generar Reporte"
              icon="file-chart"
              color={colors.warning}
              onPress={() => navigation.navigate('Reports')}
            />
          </View>
        </View>

        {/* Alertas y notificaciones */}
        {stats.lowStockProducts > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas</Text>
            <Card style={styles.alertCard}>
              <View style={styles.alertContent}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color={colors.warning}
                />
                <View style={styles.alertText}>
                  <Text style={styles.alertTitle}>Stock Bajo</Text>
                  <Text style={styles.alertDescription}>
                    {stats.lowStockProducts} producto{stats.lowStockProducts !== 1 ? 's' : ''} con stock bajo
                  </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Enlaces útiles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión</Text>
          <Card style={styles.linksCard}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => navigation.navigate('Products')}
            >
              <MaterialCommunityIcons name="package-variant" size={20} color={colors.primary} />
              <Text style={styles.linkText}>Gestionar Productos</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.linkDivider} />

            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => navigation.navigate('Categories')}
            >
              <MaterialCommunityIcons name="tag-multiple" size={20} color={colors.accent} />
              <Text style={styles.linkText}>Gestionar Categorías</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.linkDivider} />

            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => navigation.navigate('Users')}
            >
              <MaterialCommunityIcons name="account-group" size={20} color={colors.success} />
              <Text style={styles.linkText}>Gestionar Usuarios</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.linkDivider} />

            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => navigation.navigate('Reports')}
            >
              <MaterialCommunityIcons name="chart-bar" size={20} color={colors.warning} />
              <Text style={styles.linkText}>Ver Reportes</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}