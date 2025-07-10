import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/theme';
import { formatDate } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const ProfileItem = ({ icon, title, value, onPress, showArrow = false }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {value && <Text style={styles.profileItemValue}>{value}</Text>}
        </View>
      </View>
      {showArrow && (
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Mi Perfil"
        rightIcon="logout"
        onRightPress={handleLogout}
      />

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons
                name="account-circle"
                size={80}
                color={colors.primary}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.username}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {user?.role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Profile Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
          
          <ProfileItem
            icon="account"
            title="Nombre de usuario"
            value={user?.username}
          />
          
          <ProfileItem
            icon="email"
            title="Email"
            value={user?.email}
          />
          
          <ProfileItem
            icon="shield-account"
            title="Tipo de cuenta"
            value={user?.role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'}
          />
          
          <ProfileItem
            icon="calendar"
            title="Miembro desde"
            value={user?.createdAt ? formatDate(user.createdAt) : 'No disponible'}
          />
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <ProfileItem
            icon="lock"
            title="Cambiar contraseña"
            onPress={() => {
              // TODO: Implementar cambio de contraseña
              Alert.alert('Próximamente', 'Esta función estará disponible pronto');
            }}
            showArrow
          />
          
          <ProfileItem
            icon="bell"
            title="Notificaciones"
            onPress={() => {
              // TODO: Implementar configuración de notificaciones
              Alert.alert('Próximamente', 'Esta función estará disponible pronto');
            }}
            showArrow
          />
          
          <ProfileItem
            icon="help-circle"
            title="Ayuda y soporte"
            onPress={() => {
              // TODO: Implementar ayuda
              Alert.alert('Próximamente', 'Esta función estará disponible pronto');
            }}
            showArrow
          />
          
          <ProfileItem
            icon="information"
            title="Acerca de la app"
            onPress={() => {
              Alert.alert(
                'Catálogo Ropa',
                'Versión 1.0.0\n\nDesarrollado con React Native y Expo'
              );
            }}
            showArrow
          />
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Cerrar Sesión"
            variant="outline"
            onPress={handleLogout}
            style={[styles.logoutButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
            icon={() => (
              <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
            )}
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
  userCard: {
    marginBottom: 20,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 20,
  },
  settingsCard: {
    marginBottom: 20,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 16,
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  profileItemValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutSection: {
    marginBottom: 40,
  },
  logoutButton: {
    borderWidth: 1,
  },
});