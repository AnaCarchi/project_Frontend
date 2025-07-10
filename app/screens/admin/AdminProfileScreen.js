import React from 'react';
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

export default function AdminProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
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
        title="Perfil de Administrador"
        leftIcon="close"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {/* Admin Info Card */}
        <Card style={styles.adminCard}>
          <View style={styles.adminHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons
                name="shield-account"
                size={80}
                color={colors.primary}
              />
            </View>
            <View style={styles.adminInfo}>
              <Text style={styles.adminName}>{user?.username}</Text>
              <Text style={styles.adminEmail}>{user?.email}</Text>
              <View style={styles.adminBadge}>
                <MaterialCommunityIcons name="shield" size={16} color={colors.surface} />
                <Text style={styles.adminBadgeText}>Administrador</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Account Information */}
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
            value="Administrador"
          />
          
          <ProfileItem
            icon="calendar"
            title="Administrador desde"
            value={user?.createdAt ? formatDate(user.createdAt) : 'No disponible'}
          />
        </Card>

        {/* Admin Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Configuración de Administrador</Text>
          
          <ProfileItem
            icon="cog"
            title="Configuración del sistema"
            onPress={() => {
              Alert.alert('Próximamente', 'Esta función estará disponible pronto');
            }}
            showArrow
          />
          
          <ProfileItem
            icon="database"
            title="Respaldo de datos"
            onPress={() => {
              Alert.alert('Próximamente', 'Esta función estará disponible pronto');
            }}
            showArrow
          />
          
          <ProfileItem
            icon="chart-line"
            title="Estadísticas avanzadas"
            onPress={() => {
              Alert.alert('Próximamente', 'Esta función estará disponible pronto');
            }}
            showArrow
          />
          
          <ProfileItem
            icon="security"
            title="Configuración de seguridad"
            onPress={() => {
              Alert.alert('Próximamente', 'Esta función estará disponible pronto');
            }}
            showArrow
          />
        </Card>

        {/* System Info */}
        <Card style={styles.systemCard}>
          <Text style={styles.sectionTitle}>Información del Sistema</Text>
          
          <ProfileItem
            icon="information"
            title="Versión de la app"
            value="1.0.0"
          />
          
          <ProfileItem
            icon="server"
            title="Estado del servidor"
            value="Conectado"
          />
          
          <ProfileItem
            icon="help-circle"
            title="Documentación de admin"
            onPress={() => {
              Alert.alert(
                'Documentación',
                'Para acceder a la documentación completa, visita el panel web de administración.'
              );
            }}
            showArrow
          />
        </Card>

        {/* Logout Section */}
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
  userCard: {
    marginBottom: 12,
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
  userTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  roleText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  usersList: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
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
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reportsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  reportCard: {
    padding: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  formatButtonGenerating: {
    backgroundColor: colors.textSecondary,
  },
  formatButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    margin: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  adminCard: {
    marginBottom: 20,
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  adminBadgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    marginBottom: 20,
  },
  settingsCard: {
    marginBottom: 20,
  },
  systemCard: {
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